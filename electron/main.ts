import { BrowserWindow, app } from "electron";
import Window from "./Window";
import WindowNailTray from "./Tary";
import { nativeTheme, ipcMain } from "electron";
ipcMain.handle("get-system-theme", (event) => {
  event.sender.send("system-theme-changed", nativeTheme.shouldUseDarkColors);
});

// 当系统主题变化时发送通知
nativeTheme.on("updated", () => {
  // 发送给所有窗口
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send(
      "system-theme-changed",
      nativeTheme.shouldUseDarkColors
    );
  }
});

app.whenReady().then(() => {
  const window = new Window();
  new WindowNailTray(window);
});
