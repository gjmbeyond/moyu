import * as hmUI from "@zos/ui";
import { push } from "@zos/router";
import { Vibrator } from "@zos/sensor";
import { log as Logger, px } from "@zos/utils";
import { isSquare } from "../../utils/constants";
import sedentaryManager from "../../utils/sedentary";
import {
  TITLE_TEXT,
  STATUS_TEXT,
  TIME_LABEL_TEXT,
  TIME_TEXT,
  LAYER_LABEL_TEXT,
  PROGRESS_BAR_BG,
  PROGRESS_BAR_FG,
  LAYER_INDICATORS,
  STATISTICS_BUTTON,
} from "zosLoader:./index.[pf].layout.js";

const logger = Logger.getLogger("sedentary-page");

Page({
  statusTextWidget: null,
  timeTextWidget: null,
  progressBarFgWidget: null,
  layerIndicatorWidgets: [],

  build() {
    !isSquare && TITLE_TEXT && hmUI.createWidget(hmUI.widget.TEXT, TITLE_TEXT);

    this.statusTextWidget = hmUI.createWidget(hmUI.widget.TEXT, {
      ...STATUS_TEXT,
      text: "活动",
    });

    hmUI.createWidget(hmUI.widget.TEXT, TIME_LABEL_TEXT);

    this.timeTextWidget = hmUI.createWidget(hmUI.widget.TEXT, {
      ...TIME_TEXT,
      text: "00:00",
    });

    hmUI.createWidget(hmUI.widget.TEXT, LAYER_LABEL_TEXT);

    hmUI.createWidget(hmUI.widget.FILL_RECT, PROGRESS_BAR_BG);

    this.progressBarFgWidget = hmUI.createWidget(hmUI.widget.FILL_RECT, {
      ...PROGRESS_BAR_FG,
      w: 0,
    });

    this.createLayerIndicators();

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...STATISTICS_BUTTON,
      click_func: () => {
        push({
          url: "page/gt/statistics",
        });
      },
    });

    this.setupSedentaryManager();
  },

  createLayerIndicators() {
    const { x, y, w, h } = LAYER_INDICATORS;
    const indicatorCount = 3;
    const gap = 10;
    const indicatorWidth = (w - (indicatorCount - 1) * gap) / indicatorCount;

    for (let i = 0; i < indicatorCount; i++) {
      const indicator = hmUI.createWidget(hmUI.widget.FILL_RECT, {
        x: x + i * (indicatorWidth + gap),
        y: y,
        w: indicatorWidth,
        h: h,
        color: 0x333333,
        radius: px(h / 2),
      });
      this.layerIndicatorWidgets.push(indicator);
    }
  },

  setupSedentaryManager() {
    sedentaryManager.init();
    sedentaryManager.setAlertCallback(() => this.handleAlert());
    sedentaryManager.setTimeUpdateCallback((time) => this.updateTime(time));
    sedentaryManager.setLayerUpdateCallback((layer) => this.updateLayer(layer));
    sedentaryManager.setStateUpdateCallback((state) => this.updateState(state));
    sedentaryManager.startMonitoring();
  },

  handleAlert() {
    this.triggerVibration();
    this.showNotification();
  },

  triggerVibration() {
    try {
      const vibrator = new Vibrator();
      const pattern = [200, 100, 200, 100, 200];
      vibrator.start(pattern);
      logger.log("Vibration triggered");
    } catch (e) {
      logger.log("Vibration error:", e);
    }
  },

  showNotification() {
    try {
      hmUI.showToast({
        text: "起身活动",
        duration: 3000,
      });
      logger.log("Notification shown");
    } catch (e) {
      logger.log("Notification error:", e);
    }
  },

  updateTime(time) {
    if (this.timeTextWidget) {
      const formattedTime = sedentaryManager.formatTime(time);
      this.timeTextWidget.setProperty(hmUI.prop.TEXT, formattedTime);
    }

    this.updateProgressBar(time);
  },

  updateProgressBar(time) {
    if (this.progressBarFgWidget) {
      const maxTime = 1800000;
      const progress = Math.min(time / maxTime, 1);
      const { x, w: totalWidth } = PROGRESS_BAR_BG;
      const newWidth = Math.floor(totalWidth * progress);
      this.progressBarFgWidget.setProperty(hmUI.prop.MORE, {
        x: x,
        w: newWidth,
      });
    }
  },

  updateLayer(layer) {
    const maxLayer = 3;
    const displayLayer = Math.min(layer, maxLayer);

    for (let i = 0; i < this.layerIndicatorWidgets.length; i++) {
      const isActive = i < displayLayer;
      const color = isActive ? 0xFF9800 : 0x333333;
      this.layerIndicatorWidgets[i].setProperty(hmUI.prop.MORE, {
        color: color,
      });
    }
  },

  updateState(state) {
    if (this.statusTextWidget) {
      let text = "活动";
      let color = 0x4CAF50;

      if (state === 'sedentary') {
        text = "久坐";
        color = 0xFF9800;
      } else if (state === 'standing') {
        text = "站立";
        color = 0x2196F3;
      }

      this.statusTextWidget.setProperty(hmUI.prop.TEXT, text);
      this.statusTextWidget.setProperty(hmUI.prop.MORE, {
        color: color,
      });
    }
  },

  onReady() {
    logger.log("Page ready");
  },

  onShow() {
    sedentaryManager.handleAppResume();
    logger.log("Page shown");
  },

  onHide() {
    sedentaryManager.handleAppPause();
    logger.log("Page hidden");
  },

  onDestroy() {
    sedentaryManager.stopMonitoring();
    logger.log("Page destroyed");
  },
});