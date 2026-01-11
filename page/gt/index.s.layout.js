import * as hmUI from "@zos/ui";
import { px } from "@zos/utils";
import { DEVICE_WIDTH } from "../../utils/constants";

export const TITLE_TEXT = null;

export const STATUS_TEXT = {
  text: "活动",
  x: px(4),
  y: px(60),
  w: DEVICE_WIDTH - 2 * px(4),
  h: px(50),
  color: 0x4CAF50,
  text_size: px(36),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
};

export const TIME_LABEL_TEXT = {
  text: "连续久坐时间",
  x: px(4),
  y: px(120),
  w: DEVICE_WIDTH - 2 * px(4),
  h: px(38),
  color: 0x999999,
  text_size: px(24),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
};

export const TIME_TEXT = {
  text: "00:00",
  x: px(4),
  y: px(158),
  w: DEVICE_WIDTH - 2 * px(4),
  h: px(80),
  color: 0xffffff,
  text_size: px(70),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
};

export const LAYER_LABEL_TEXT = {
  text: "当前层级",
  x: px(4),
  y: px(238),
  w: DEVICE_WIDTH - 2 * px(4),
  h: px(38),
  color: 0x999999,
  text_size: px(24),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
};

export const PROGRESS_BAR_BG = {
  x: px(4),
  y: px(286),
  w: DEVICE_WIDTH - 2 * px(4),
  h: px(16),
  color: 0x333333,
  radius: px(8),
};

export const PROGRESS_BAR_FG = {
  x: px(4),
  y: px(286),
  w: 0,
  h: px(16),
  color: 0xFF9800,
  radius: px(8),
};

export const LAYER_INDICATORS = {
  x: px(4),
  y: px(318),
  w: DEVICE_WIDTH - 2 * px(4),
  h: px(24),
};

export const STATISTICS_BUTTON = {
  text: "查看统计",
  press_color: 0x333333,
  normal_color: 0x1a1a1a,
  x: px(71),
  y: px(362),
  w: DEVICE_WIDTH - 2 * px(71),
  h: px(56),
  color: 0xffffff,
  text_size: px(28),
  radius: px(28),
};