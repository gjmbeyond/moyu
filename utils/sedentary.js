import { log as Logger } from "@zos/utils";
import sensorManager from "./sensor";

const logger = Logger.getLogger("sedentary");

const LAYER_INTERVAL = 600000;
const ALERT_THRESHOLD = 1800000;
const CHECK_INTERVAL = 60000;
const TIME_TOLERANCE = 30000;

class SedentaryManager {
  constructor() {
    this.currentSedentaryTime = 0;
    this.currentLayer = 0;
    this.lastCheckTime = 0;
    this.lastActivityState = 'unknown';
    this.isMonitoring = false;
    this.checkTimer = null;
    this.onAlertCallback = null;
    this.onTimeUpdateCallback = null;
    this.onLayerUpdateCallback = null;
    this.onStateUpdateCallback = null;
    this.lastAlertTime = 0;
    this.alertCooldown = 60000;
  }

  init() {
    try {
      sensorManager.init();
      this.lastCheckTime = Date.now();
      logger.log("SedentaryManager initialized");
      return true;
    } catch (e) {
      logger.log("SedentaryManager init error:", e);
      return false;
    }
  }

  startMonitoring() {
    if (this.isMonitoring) {
      logger.log("Already monitoring");
      return;
    }

    try {
      sensorManager.startMonitoring();
      this.lastCheckTime = Date.now();
      this.isMonitoring = true;
      
      this.startCheckTimer();
      logger.log("Sedentary monitoring started");
    } catch (e) {
      logger.log("Start monitoring error:", e);
    }
  }

  stopMonitoring() {
    if (!this.isMonitoring) {
      return;
    }

    try {
      this.stopCheckTimer();
      sensorManager.stopMonitoring();
      this.isMonitoring = false;
      logger.log("Sedentary monitoring stopped");
    } catch (e) {
      logger.log("Stop monitoring error:", e);
    }
  }

  startCheckTimer() {
    if (this.checkTimer) {
      return;
    }

    this.checkTimer = setInterval(() => {
      this.checkSedentaryState();
    }, CHECK_INTERVAL);
  }

  stopCheckTimer() {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = null;
    }
  }

  checkSedentaryState() {
    const now = Date.now();
    const timeDiff = now - this.lastCheckTime;
    
    const activityState = sensorManager.getActivityState();
    
    if (activityState === 'sedentary') {
      this.currentSedentaryTime += timeDiff;
      
      const newLayer = Math.floor(this.currentSedentaryTime / LAYER_INTERVAL);
      
      if (newLayer > this.currentLayer) {
        this.currentLayer = newLayer;
        if (this.onLayerUpdateCallback) {
          this.onLayerUpdateCallback(this.currentLayer);
        }
      }
      
      if (this.currentSedentaryTime >= ALERT_THRESHOLD) {
        this.triggerAlert();
      }
    } else {
      this.resetSedentaryTime();
    }
    
    if (this.lastActivityState !== activityState && this.onStateUpdateCallback) {
      this.onStateUpdateCallback(activityState);
    }
    
    this.lastActivityState = activityState;
    this.lastCheckTime = now;
    
    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(this.currentSedentaryTime);
    }
  }

  triggerAlert() {
    const now = Date.now();
    if (now - this.lastAlertTime < this.alertCooldown) {
      return;
    }
    
    this.lastAlertTime = now;
    
    if (this.onAlertCallback) {
      this.onAlertCallback();
    }
    
    this.recordSedentaryEvent();
  }

  recordSedentaryEvent() {
    try {
      const app = getApp();
      if (app && app.recordSedentaryEvent) {
        app.recordSedentaryEvent();
      }
    } catch (e) {
      logger.log("Record sedentary event error:", e);
    }
  }

  resetSedentaryTime() {
    if (this.currentSedentaryTime > 0) {
      this.currentSedentaryTime = 0;
      this.currentLayer = 0;
      
      if (this.onLayerUpdateCallback) {
        this.onLayerUpdateCallback(this.currentLayer);
      }
      
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.currentSedentaryTime);
      }
    }
  }

  handleAppPause() {
    this.stopCheckTimer();
  }

  handleAppResume() {
    this.handleAppResumeInternal();
    this.startCheckTimer();
  }

  handleAppResumeInternal() {
    const now = Date.now();
    const timeDiff = now - this.lastCheckTime;
    
    if (timeDiff > CHECK_INTERVAL * 2) {
      const activityState = sensorManager.getActivityState();
      
      if (activityState === 'sedentary') {
        const compensatedTime = Math.min(timeDiff, CHECK_INTERVAL * 5);
        this.currentSedentaryTime += compensatedTime;
        
        const newLayer = Math.floor(this.currentSedentaryTime / LAYER_INTERVAL);
        if (newLayer > this.currentLayer) {
          this.currentLayer = newLayer;
          if (this.onLayerUpdateCallback) {
            this.onLayerUpdateCallback(this.currentLayer);
          }
        }
        
        if (this.currentSedentaryTime >= ALERT_THRESHOLD) {
          this.triggerAlert();
        }
      } else {
        this.resetSedentaryTime();
      }
    }
    
    this.lastCheckTime = now;
    
    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(this.currentSedentaryTime);
    }
  }

  getCurrentSedentaryTime() {
    return this.currentSedentaryTime;
  }

  getCurrentLayer() {
    return this.currentLayer;
  }

  getActivityState() {
    return sensorManager.getActivityState();
  }

  formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  setAlertCallback(callback) {
    this.onAlertCallback = callback;
  }

  setTimeUpdateCallback(callback) {
    this.onTimeUpdateCallback = callback;
  }

  setLayerUpdateCallback(callback) {
    this.onLayerUpdateCallback = callback;
  }

  setStateUpdateCallback(callback) {
    this.onStateUpdateCallback = callback;
  }

  reset() {
    this.currentSedentaryTime = 0;
    this.currentLayer = 0;
    this.lastCheckTime = Date.now();
    this.lastActivityState = 'unknown';
    this.lastAlertTime = 0;
    sensorManager.reset();
  }
}

export default new SedentaryManager();