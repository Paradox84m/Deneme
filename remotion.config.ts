import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
// Instagram için standart renk: yuv420p, BT.709, TV aralığı
Config.setPixelFormat('yuv420p');
Config.setColorSpace('bt709');
