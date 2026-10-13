# 案場紀錄影片

五個服務子頁的「案場紀錄」輪播會讀這個資料夾。檔名是寫死在 HTML 裡的，
請直接用下面的名字覆蓋上去，不用改程式：

| 檔名 | 用在哪一頁 | 案場 |
| --- | --- | --- |
| `case-pv-01.mp4` | service-pv.html | 彰濱工業區廠房屋頂電廠 |
| `case-pv-02.mp4` | service-pv.html | 嘉義太保農棚型案場 |
| `case-pv-03.mp4` | service-pv.html | 桃園物流中心屋頂系統 |
| `case-om-01.mp4` | service-om.html | 台南七股鹽田地面型電廠 |
| `case-om-02.mp4` | service-om.html | 中部屋頂案場群組維運 |
| `case-om-03.mp4` | service-om.html | 高雄廠區自發自用系統 |
| `case-regional-01.mp4` | service-regional.html | 樹林園區級儲能調頻案場 |
| `case-regional-02.mp4` | service-regional.html | 雲林工業區微電網示範 |
| `case-regional-03.mp4` | service-regional.html | 竹北社區型能源管理 |
| `case-data-01.mp4` | service-data.html | 集團用電儀表板導入 |
| `case-data-02.mp4` | service-data.html | 案場遠端監控平台 |
| `case-data-03.mp4` | service-data.html | 用電行為分析與需量預測 |
| `case-trading-01.mp4` | service-trading.html | 半導體供應鏈轉供專案 |
| `case-trading-02.mp4` | service-trading.html | 中小企業綠電團購 |
| `case-trading-03.mp4` | service-trading.html | 既有售電合約再媒合 |

## 規格建議

- 格式 **H.264 MP4**（`.mp4`），相容性最好
- 解析度 **1920×1080**，比例 16:9（版面是 16:9 裁切，其他比例會被切邊）
- 長度 **20–40 秒**，檔案控制在 **8 MB 以內**；輪播是手動切換、不自動播放，
  但仍要避免單頁一次拖三支大檔
- 影片是 `muted` + `loop` 播放，**不要靠旁白敘事**，重要資訊請上字幕或放在右側欄位
- 轉檔參考指令：
  ```sh
  ffmpeg -i 原始檔.mov -vf "scale=1920:-2" -c:v libx264 -crf 24 \
         -preset slow -movflags +faststart -an case-pv-01.mp4
  ```
  （`-movflags +faststart` 讓影片可以邊下載邊播，不加的話要整支載完才會動）

## 封面圖

每支影片的封面（`poster`）目前先用 `assets/img/photo/` 既有的圖。
有實際的案場照片後，直接換掉 HTML 裡該張 slide 的 `poster="..."` 路徑即可。

## 檔案還沒放上來的時候

`<source>` 讀不到檔案時，前端會自動收起播放鍵、改以封面圖呈現，
不會出現破圖或按了沒反應的按鈕，所以可以分批上架。
