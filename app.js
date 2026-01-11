import { log as Logger } from "@zos/utils";
import LocalStorage from "./utils/storage";

const logger = Logger.getLogger("sedentary-app");
const fileName = "sedentary_data.txt";

App({
  globalData: {
    localStorage: null,
    sedentaryData: {
      currentSedentaryTime: 0,
      lastUpdateTime: 0,
      todaySedentaryCount: 0,
      historyData: {}
    }
  },
  onCreate() {
    try {
      this.globalData.localStorage = new LocalStorage(fileName);
      const savedData = this.globalData.localStorage.get();
      
      if (savedData && savedData.historyData) {
        this.globalData.sedentaryData = {
          currentSedentaryTime: 0,
          lastUpdateTime: Date.now(),
          todaySedentaryCount: 0,
          historyData: this.cleanOldData(savedData.historyData)
        };
      } else {
        this.initHistoryData();
      }
      
      this.checkNewDay();
    } catch (e) {
      logger.log("--->e:", e);
      this.initHistoryData();
    }
  },

  onDestroy() {
    this.saveData();
  },

  saveData() {
    try {
      this.globalData.localStorage.set(this.globalData.sedentaryData);
      logger.log("Data saved successfully");
    } catch (e) {
      logger.log("Save data error:", e);
    }
  },

  checkNewDay() {
    const today = this.formatDate(new Date());
    const historyData = this.globalData.sedentaryData.historyData;
    
    if (!historyData[today]) {
      const oldestDate = Object.keys(historyData).sort()[0];
      if (oldestDate) {
        delete historyData[oldestDate];
      }
      historyData[today] = 0;
      this.globalData.sedentaryData.todaySedentaryCount = 0;
      this.saveData();
      logger.log("New day detected, data updated");
    }
  },

  recordSedentaryEvent() {
    const today = this.formatDate(new Date());
    if (this.globalData.sedentaryData.historyData[today] !== undefined) {
      this.globalData.sedentaryData.historyData[today]++;
      this.globalData.sedentaryData.todaySedentaryCount++;
      this.saveData();
      logger.log("Sedentary event recorded for:", today);
    }
  },

  getHistoryData() {
    return this.globalData.sedentaryData.historyData;
  },

  getTodayCount() {
    const today = this.formatDate(new Date());
    return this.globalData.sedentaryData.historyData[today] || 0;
  },

  initHistoryData() {
    const historyData = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = this.formatDate(date);
      historyData[dateKey] = 0;
    }
    this.globalData.sedentaryData.historyData = historyData;
  },

  cleanOldData(historyData) {
    const cleanedData = {};
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    for (const dateKey in historyData) {
      const date = new Date(dateKey);
      if (date >= sevenDaysAgo && date <= today) {
        cleanedData[dateKey] = historyData[dateKey];
      }
    }

    const missingDays = 7 - Object.keys(cleanedData).length;
    for (let i = 0; i < missingDays; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(date.getDate() + i);
      const dateKey = this.formatDate(date);
      if (!cleanedData[dateKey]) {
        cleanedData[dateKey] = 0;
      }
    }

    return cleanedData;
  },

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
});
