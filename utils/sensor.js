import { Accelerometer } from "@zos/sensor";
import { log as Logger } from "@zos/utils";

const logger = Logger.getLogger("sensor");

const SEDENTARY_THRESHOLD = 50;
const ACTIVE_THRESHOLD = 200;
const SAMPLE_SIZE = 25;

class SensorManager {
  constructor() {
    this.accelerometer = null;
    this.accelerationData = [];
    this.isMonitoring = false;
    this.lastActivityState = 'unknown';
  }

  init() {
    try {
      this.accelerometer = new Accelerometer();
      logger.log("SensorManager initialized");
      return true;
    } catch (e) {
      logger.log("SensorManager init error:", e);
      return false;
    }
  }

  startMonitoring() {
    if (!this.accelerometer) {
      this.init();
    }

    if (!this.accelerometer) {
      logger.log("Failed to initialize accelerometer");
      return false;
    }

    try {
      this.accelerometer.on("change", (data) => {
        this.handleSensorData(data);
      });
      this.isMonitoring = true;
      logger.log("Sensor monitoring started");
      return true;
    } catch (e) {
      logger.log("Start monitoring error:", e);
      return false;
    }
  }

  stopMonitoring() {
    if (this.accelerometer && this.isMonitoring) {
      try {
        this.accelerometer.off("change");
        this.isMonitoring = false;
        this.accelerationData = [];
        logger.log("Sensor monitoring stopped");
      } catch (e) {
        logger.log("Stop monitoring error:", e);
      }
    }
  }

  handleSensorData(data) {
    const { x, y, z } = data;
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    
    this.accelerationData.push(magnitude);
    
    if (this.accelerationData.length > SAMPLE_SIZE) {
      this.accelerationData.shift();
    }
  }

  getActivityState() {
    if (this.accelerationData.length < SAMPLE_SIZE) {
      return this.lastActivityState;
    }

    const avgMagnitude = this.calculateAverageMagnitude();
    const variance = this.calculateVariance(avgMagnitude);

    let currentState;
    if (avgMagnitude < SEDENTARY_THRESHOLD && variance < 30) {
      currentState = 'sedentary';
    } else if (avgMagnitude > ACTIVE_THRESHOLD || variance > 100) {
      currentState = 'active';
    } else {
      currentState = 'standing';
    }

    this.lastActivityState = currentState;
    return currentState;
  }

  calculateAverageMagnitude() {
    if (this.accelerationData.length === 0) return 0;
    
    let sum = 0;
    for (let i = 0; i < this.accelerationData.length; i++) {
      sum += this.accelerationData[i];
    }
    return sum / this.accelerationData.length;
  }

  calculateVariance(mean) {
    if (this.accelerationData.length === 0) return 0;
    
    let sumSquaredDiff = 0;
    for (let i = 0; i < this.accelerationData.length; i++) {
      const diff = this.accelerationData[i] - mean;
      sumSquaredDiff += diff * diff;
    }
    return sumSquaredDiff / this.accelerationData.length;
  }

  getCurrentAcceleration() {
    if (this.accelerationData.length === 0) return 0;
    return this.accelerationData[this.accelerationData.length - 1];
  }

  reset() {
    this.accelerationData = [];
    this.lastActivityState = 'unknown';
  }
}

export default new SensorManager();