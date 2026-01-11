import { statSync, writeFileSync, readFileSync } from "@zos/fs";
import { log as Logger } from "@zos/utils";

const logger = Logger.getLogger("storage");

export default class LocalStorage {
  constructor(fileName = "") {
    this.fileName = fileName;
    this.contentObj = {};
  }

  set(obj) {
    try {
      writeFileSync({
        path: this.fileName,
        data: JSON.stringify(obj),
        options: {
          encoding: "utf8",
        },
      });
      this.contentObj = obj;
      return true;
    } catch (error) {
      logger.log("Storage set error:", error);
      return false;
    }
  }

  get() {
    try {
      const fStat = statSync({
        path: this.fileName,
      });
      if (fStat) {
        try {
          this.contentObj = JSON.parse(
            readFileSync({
              path: this.fileName,
              options: {
                encoding: "utf8",
              },
            })
          );
        } catch (error) {
          logger.log("Storage parse error:", error);
          this.contentObj = {};
        }
      }
    } catch (error) {
      logger.log("Storage stat error:", error);
      this.contentObj = {};
    }

    return this.contentObj;
  }

  update(key, value) {
    if (!this.contentObj) {
      this.contentObj = {};
    }
    this.contentObj[key] = value;
    return this.set(this.contentObj);
  }

  remove(key) {
    if (this.contentObj && this.contentObj[key]) {
      delete this.contentObj[key];
      return this.set(this.contentObj);
    }
    return false;
  }

  clear() {
    this.contentObj = {};
    return this.set(this.contentObj);
  }

  exists() {
    try {
      const fStat = statSync({
        path: this.fileName,
      });
      return fStat !== null;
    } catch (error) {
      return false;
    }
  }
}
