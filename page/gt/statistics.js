import * as hmUI from "@zos/ui";
import { replace } from "@zos/router";
import { log as Logger, px } from "@zos/utils";
import { isSquare } from "../../utils/constants";
import {
  TITLE_TEXT,
  CHART_CONTAINER,
  BACK_BUTTON,
  CHART_AXIS_COLOR,
  CHART_BAR_COLOR,
  CHART_TEXT_COLOR,
  CHART_TEXT_SIZE,
  CHART_BAR_WIDTH,
  CHART_BAR_GAP,
} from "zosLoader:./statistics.[pf].layout.js";

const logger = Logger.getLogger("statistics-page");

Page({
  chartWidgets: [],
  historyData: {},

  build() {
    !isSquare && TITLE_TEXT && hmUI.createWidget(hmUI.widget.TEXT, TITLE_TEXT);

    this.loadHistoryData();
    this.createChart();

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...BACK_BUTTON,
      click_func: () => {
        replace({
          url: "page/gt/index",
        });
      },
    });
  },

  loadHistoryData() {
    try {
      const app = getApp();
      const globalData = app._options.globalData;
      this.historyData = globalData.sedentaryData.historyData || {};
      logger.log("Loaded history data:", this.historyData);
    } catch (e) {
      logger.log("Load history data error:", e);
      this.historyData = {};
    }
  },

  createChart() {
    const { x, y, w, h } = CHART_CONTAINER;
    
    const chartGroup = hmUI.createWidget(hmUI.widget.GROUP, {
      x: x,
      y: y,
      w: w,
      h: h,
    });

    this.drawAxes(chartGroup, x, y, w, h);
    this.drawBars(chartGroup, x, y, w, h);
    this.drawLabels(chartGroup, x, y, w, h);
  },

  drawAxes(group, x, y, w, h) {
    const axisWidth = 2;
    const padding = 20;

    group.createWidget(hmUI.widget.FILL_RECT, {
      x: padding,
      y: padding,
      w: axisWidth,
      h: h - padding * 2,
      color: CHART_AXIS_COLOR,
    });

    group.createWidget(hmUI.widget.FILL_RECT, {
      x: padding,
      y: h - padding - axisWidth,
      w: w - padding * 2,
      h: axisWidth,
      color: CHART_AXIS_COLOR,
    });
  },

  drawBars(group, x, y, w, h) {
    const padding = 25;
    const chartHeight = h - padding * 2;
    const chartWidth = w - padding * 2;
    
    const days = this.getLast7Days();
    const maxCount = this.getMaxCount(days);
    
    const barAreaWidth = chartWidth - 10;
    const totalBarWidth = CHART_BAR_WIDTH * 7 + CHART_BAR_GAP * 6;
    const startX = padding + (barAreaWidth - totalBarWidth) / 2;
    
    days.forEach((day, index) => {
      const count = this.historyData[day.dateKey] || 0;
      const barHeight = maxCount > 0 ? (count / maxCount) * (chartHeight - 40) : 0;
      
      const barX = startX + index * (CHART_BAR_WIDTH + CHART_BAR_GAP);
      const barY = h - padding - barHeight - 10;
      
      const bar = group.createWidget(hmUI.widget.FILL_RECT, {
        x: barX,
        y: barY,
        w: CHART_BAR_WIDTH,
        h: barHeight,
        color: CHART_BAR_COLOR,
        radius: px(4),
      });
      
      this.chartWidgets.push(bar);
      
      if (count > 0) {
        const countText = group.createWidget(hmUI.widget.TEXT, {
          x: barX,
          y: barY - 25,
          w: CHART_BAR_WIDTH,
          h: 20,
          text: count.toString(),
          color: CHART_TEXT_COLOR,
          text_size: CHART_TEXT_SIZE,
          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.CENTER_V,
        });
        this.chartWidgets.push(countText);
      }
    });
  },

  drawLabels(group, x, y, w, h) {
    const padding = 25;
    const chartWidth = w - padding * 2;
    
    const days = this.getLast7Days();
    const barAreaWidth = chartWidth - 10;
    const totalBarWidth = CHART_BAR_WIDTH * 7 + CHART_BAR_GAP * 6;
    const startX = padding + (barAreaWidth - totalBarWidth) / 2;
    
    days.forEach((day, index) => {
      const labelX = startX + index * (CHART_BAR_WIDTH + CHART_BAR_GAP) + CHART_BAR_WIDTH / 2;
      const labelY = h - padding + 5;
      
      const label = group.createWidget(hmUI.widget.TEXT, {
        x: labelX - 20,
        y: labelY,
        w: 40,
        h: 20,
        text: day.label,
        color: CHART_TEXT_COLOR,
        text_size: CHART_TEXT_SIZE,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.CENTER_V,
      });
      this.chartWidgets.push(label);
    });
  },

  getLast7Days() {
    const days = [];
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dateKey = this.formatDate(date);
      const dayOfWeek = date.getDay();
      const label = weekDays[dayOfWeek];
      
      days.push({
        dateKey: dateKey,
        label: label,
      });
    }
    
    return days;
  },

  getMaxCount(days) {
    let maxCount = 0;
    days.forEach(day => {
      const count = this.historyData[day.dateKey] || 0;
      if (count > maxCount) {
        maxCount = count;
      }
    });
    return maxCount > 0 ? maxCount : 5;
  },

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  onReady() {
    logger.log("Statistics page ready");
  },

  onShow() {
    logger.log("Statistics page shown");
  },

  onHide() {
    logger.log("Statistics page hidden");
  },

  onDestroy() {
    logger.log("Statistics page destroyed");
  },
});