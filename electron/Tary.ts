import { app, Tray, Menu, MenuItem } from "electron";
import path from "path";
import Window from "./Window";
class WindowNailTray {
  tray: Tray | undefined;
  window: Window | undefined;
  contextMenu: Menu | undefined;
  windowUpdateTimeout: NodeJS.Timeout | undefined;
  exit = true;
  constructor(window: Window) {
    app.whenReady().then(() => {
      // 设置托盘图标
      this.tray = new Tray(
        path.join(process.env.VITE_PUBLIC, "nail-white.png")
      );
      this.window = window;
      // 设置托盘图标的工具提示
      this.tray.setToolTip("windows-nail");
      this.tray.on("click", () => {
        if (this.window?.win) {
          if (this.window.win.isMinimized()) {
            this.window.win.restore();
          } else {
            this.window.win.minimize();
          }
        }
      });
    });

    // 为托盘设置右键菜单
    this.updateContextMenu();
  }
  updateContextMenu() {
    this.windowUpdateTimeout = setInterval(() => {
      this.contextMenu = Menu.buildFromTemplate(
        (() => {
          const res = this.window
            ?.getAllWindowsInfo()
            .map((win) => ({
              label: win.title,
              type: "radio",
              checked: win.top,
              click: () => {
                this.exit = false;
                this.window?.switchWindowTopmostByHWND(win.address);
              },
            }))
            .concat({
              label: "退出",
              type: "radio",
              checked: this.exit,
              click: () => {
                this.destroy();
                this.window?.close();
                app.quit();
              },
            }) as unknown as MenuItem[];
          return res || [];
        })()
      );
      this.tray?.setContextMenu(this.contextMenu);
    }, 1000);
  }
  destroy() {
    clearInterval(this.windowUpdateTimeout);
  }
}

export default WindowNailTray;
