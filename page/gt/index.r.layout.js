import * as hmUI from "@zos/ui";
import { px } from "@zos/utils";
import { DEVICE_WIDTH } from "../../utils/constants";

export const TITLE_TEXT = {
  text: "久坐状态",
  x: px(96),
  y: px(40),
  w: DEVICE_WIDTH - 2 * px(96),
  h: px(46),
  color: 0xffffff,
  text_size: px(36),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
  text_style: hmUI.text_style.WRAP,
};

export const STATUS_TEXT = {
  text: "活动",
  x: px(40),
  y: px(100),
  w: DEVICE_WIDTH - 2 * px(40),
  h: px(50),
  color: 0x4CAF50,
  text_size: px(40),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
};

export const TIME_LABEL_TEXT = {
  text: "连续久坐时间",
  x: px(40),
  y: px(160),
  w: DEVICE_WIDTH - 2 * px(40),
  h: px(38),
  color: 0x999999,
  text_size: px(28),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
};

export const TIME_TEXT = {
  text: "00:00",
  x: px(40),
  y: px(200),
  w: DEVICE_WIDTH - 2 * px(40),
  h: px(100),
  color: 0xffffff,
  text_size: px(90),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
};

export const LAYER_LABEL_TEXT = {
  text: "当前层级",
  x: px(40),
  y: px(310),
  w: DEVICE_WIDTH - 2 * px(40),
  h: px(38),
  color: 0x999999,
  text_size: px(28),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
};

export const PROGRESS_BAR_BG = {
  x: px(40),
  y: px(360),
  w: DEVICE_WIDTH - 2 * px(40),
  h: px(20),
  color: 0x333333,
  radius: px(10),
};

export const PROGRESS_BAR_FG = {
  x: px(40),
  y: px(360),
  w: 0,
  h: px(20),
  color: 0xFF9800,
  radius: px(10),
};

export const LAYER_INDICATORS = {
  x: px(40),
  y: px(400),
  w: DEVICE_WIDTH - 2 * px(40),
  h: px(30),
};

export const STATISTICS_BUTTON = {
  text: "查看统计",
  press_color: 0x333333,
  normal_color: 0x1a1a1a,
  x: px(108),
  y: px(440),
  w: DEVICE_WIDTH - 2 * px(108),
  h: px(56),
  color: 0xffffff,
  text_size: px(32),
  radius: px(28),
};