rOpen #loadingBar {
  right: var(--sidebar-width);
}

#outerContainer.sidebarResizing #loadingBar {
  /* Improve responsiveness and avoid visual glitches when the sidebar is resized. */
  transition-duration: 0s;
}

#loadingBar .progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  background-color: var(--progressBar-color);
  overflow: hidden;
  transition: width 200ms;
}

@keyframes progressIndeterminate {
  0% {
    left: -142px;
  }
  100% {
    left: 0;
  }
}

#loadingBar .progress.indeterminate {
  background-color: var(--progressBar-indeterminate-bg-color);
  transition: none;
}

#loadingBar .progress.indeterminate .glimmer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: calc(100% + 150px);
  background: repeating-linear-gradient(
    135deg,
    var(--progressBar-indeterminate-blend-color) 0,
    var(--progressBar-indeterminate-bg-color) 5px,
    var(--progressBar-indeterminate-bg-color) 45px,
    var(--progressBar-color) 55px,
    var(--progressBar-color) 95px,
    var(--progressBar-indeterminate-blend-color) 100px
  );
  animation: progressIndeterminate 1s linear infinite;
}

.findbar,
.secondaryToolbar {
  top: 32px;
  position: absolute;
  z-index: 10000;
  height: auto;
  min-width: 16px;
  padding: 0 4px;
  margin: 4px 2px;
  color: rgba(217, 217, 217, 1);
  font-size: 12px;
  line-height: 14px;
  text-align: left;
  cursor: default;
}

.findbar {
  min-width: 300px;
  background-color: var(--toolbar-bg-color);
}
.findbar > div {
  height: 32px;
}
.findbar.wrapContainers > div {
  clear: both;
}
.findbar.wrapContainers > div#findbarMessageContainer {
  height: auto;
}
html[dir="ltr"] .findbar {
  left: 64px;
}
html[dir="rtl"] .findbar {
  right: 64px;
}

.findbar .splitToolbarButton {
  margin-top: 3px;
}
html[dir="ltr"] .findbar .splitToolbarButton {
  margin-left: 0;
  margin-right: 5px;
}
html[dir="rtl"] .findbar .splitToolbarButton {
  margin-left: 5px;
  margin-right: 0;
}

.findbar .splitToolbarButton > .toolbarButton {
  background-color: var(--findbar-nextprevious-btn-bg-color);
  border-radius: 0;
  height: 26px;
  border-top: 1px solid var(--field-border-color);
  border-bottom: 1px solid var(--field-border-color);
}

.findbar .splitToolbarButton > .toolbarButton::before {
  top: 5px;
}

.findbar .splitToolbarButton > .findNext {
  width: 29px;
}
html[dir="ltr"] .findbar .splitToolbarButton > .findNext {
  border-bottom-right-radius: 2px;
  border-top-right-radius: 2px;
  border-right: 1px solid var(--field-border-color);
}
html[dir="rtl"] .findbar .splitToolbarButton > .findNext {
  border-bottom-left-radius: 2px;
  border-top-left-radius: 2px;
  border-left: 1px solid var(--field-border-color);
}

.findbar input[type="checkbox"] {
  pointer-events: none;
}

.findbar label {
  user-select: none;
}

.findbar label:hover,
.findbar input:focus + label {
  color: var(--toggled-btn-color);
  background-color: var(--button-hover-color);
}

html[dir="ltr"] #findInput {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
html[dir="rtl"] #findInput {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.findbar .toolbarField[type="checkbox"]:checked + .toolbarLabel {
  background-color: var(--toggled-btn-bg-color) !important;
  color: var(--toggled-btn-color);
}

#findInput {
  width: 200px;
}
#findInput::placeholder {
  font-style: normal;
}
#findInput[data-status="pending"] {
  background-image: var(--loading-icon);
  background-repeat: no-repeat;
  background-position: 98%;
}
html[dir="rtl"] #findInput[data-status="pending"] {
  background-position: 3px;
}
#findInput[data-status="notFound"] {
  background-color: rgba(255, 102, 102, 1);
}

.secondaryToolbar {
  padding: 6px 0 10px;
  height: auto;
  z-index: 30000;
  background-color: var(--doorhanger-bg-color);
}
html[dir="ltr"] .secondaryToolbar {
  right: 4px;
}
html[dir="rtl"] .secondaryToolbar {
  left: 4px;
}

#secondaryToolbarButtonContainer {
  max-width: 220px;
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: -4px;
}

#secondaryToolbarButtonContainer.hiddenScrollModeButtons > .scrollModeButtons,
#secondaryToolbarButtonContainer.hiddenSpreadModeButtons > .spreadModeButtons {
  display: none !important;
}

.doorHanger,
.doorHangerRight {
  border-radius: 2px;
  box-shadow: 0 1px 5px var(--doorhanger-border-color),
    0 0 0 1px var(--doorhanger-border-color);
  border: var(--doorhanger-border-color-whcm);
}
.doorHanger:after,
.doorHanger:before,
.doorHangerRight:after,
.doorHangerRight:before {
  bottom: 100%;
  border: solid rgba(0, 0, 0, 0);
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
  opacity: var(--doorhanger-triangle-opacity-whcm);
}
.doorHanger:after,
.doorHangerRight:after {
  border-width: 8px;
}
.doorHanger:after {
  border-bottom-color: var(--toolbar-bg-color);
}
.doorHangerRight:after {
  border-bottom-color: var(--doorhanger-bg-color);
}
.doorHanger:before,
.doorHangerRight:before {
  border-bottom-color: var(--doorhanger-border-color);
  border-width: 9px;
}

html[dir="ltr"] .doorHanger:after,
html[dir="rtl"] .doorHangerRight:after {
  left: 10px;
  margin-left: -8px;
}

html[dir="ltr"] .doorHanger:before,
html[dir="rtl"] .doorHangerRight:before {
  left: 10px;
  margin-left: -9px;
}

html[dir="rtl"] .doorHanger:after,
html[dir="ltr"] .doorHangerRight:after {
  right: 10px;
  margin-right: -8px;
}

html[dir="rtl"] .doorHanger:before,
html[dir="ltr"] .doorHangerRight:before {
  right: 10px;
  margin-right: -9px;
}

#findResultsCount {
  background-color: rgba(217, 217, 217, 1);
  color: rgba(82, 82, 82, 1);
  text-align: center;
  padding: 4px 5px;
  margin: 5px;
}

#findMsg {
  color: rgba(251, 0, 0, 1);
}
#findMsg:empty {
  display: none;
}

#toolbarViewerMiddle {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

html[dir="ltr"] #toolbarViewerLeft,
html[dir="rtl"] #toolbarViewerRight,
html[dir="ltr"] #toolbarSidebarLeft,
html[dir="rtl"] #toolbarSidebarRight {
  float: left;
}
html[dir="ltr"] #toolbarViewerRight,
html[dir="rtl"] #toolbarViewerLeft,
html[dir="ltr"] #toolbarSidebarRight,
html[dir="rtl"] #toolbarSidebarLeft {
  float: right;
}
html[dir="ltr"] #toolbarViewerLeft > *,
html[dir="ltr"] #toolbarViewerMiddle > *,
html[dir="ltr"] #toolbarViewerRight > *,
html[dir="ltr"] #toolbarSidebarLeft *,
html[dir="ltr"] #toolbarSidebarRight *,
html[dir="ltr"] .findbar * {
  position: relative;
  float: left;
}
html[dir="rtl"] #toolbarViewerLeft > *,
html[dir="rtl"] #toolbarViewerMiddle > *,
html[dir="rtl"] #toolbarViewerRight > *,
html[dir="rtl"] #toolbarSidebarLeft *,
html[dir="rtl"] #toolbarSidebarRight *,
html[dir="rtl"] .findbar * {
  position: relative;
  float: right;
}

.splitToolbarButton {
  margin: 2px 2px 0;
  display: inline-block;
}
html[dir="ltr"] .splitToolbarButton > .toolbarButton {
  float: left;
}
html[dir="rtl"] .splitToolbarButton > .toolbarButton {
  float: right;
}

.toolbarButton,
.secondaryToolbarButton,
.overlayButton {
  border: 0 none;
  background: none;
  width: 28px;
  height: 28px;
}

.overlayButton:hover,
.overlayButton:focus {
  background-color: var(--overlay-button-hover-bg-color);
}

.overlayButton:hover > span,
.overlayButton:focus > span {
  color: var(--overlay-button-hover-color);
}

.toolbarButton > span {
  display: inline-block;
  width: 0;
  height: 0;
  overflow: hidden;
}

.toolbarButton[disabled],
.secondaryToolbarButton[disabled],
.overlayButton[disabled] {
  opacity: 0.5;
}

.splitToolbarButton.toggled .toolbarButton {
  margin: 0;
}

.splitToolbarButton > .toolbarButton:hover,
.splitToolbarButton > .toolbarButton:focus,
.dropdownToolbarButton:hover,
.toolbarButton.textButton:hover,
.toolbarButton.textButton:focus {
  background-color: var(--button-hover-color);
  z-index: 199;
}
.splitToolbarButton > .toolbarButton {
  position: relative;
}
html[dir="ltr"] .splitToolbarButton > .toolbarButton:first-child,
html[dir="rtl"] .splitToolbarButton > .toolbarButton:last-child {
  margin: 0;
}
html[dir="ltr"] .splitToolbarButton > .toolbarButton:last-child,
html[dir="rtl"] .splitToolbarButton > .toolbarButton:first-child {
  margin: 0;
}
.splitToolbarButtonSeparator {
  padding: 10px 0;
  width: 1px;
  background-color: var(--separator-color);
  z-index: 99;
  display: inline-block;
  margin: 4px 0;
}

.findbar .splitToolbarButtonSeparator {
  background-color: var(--field-border-color);
  margin: 0;
  padding: 13px 0;
}

html[dir="ltr"] .splitToolbarButtonSeparator {
  float: left;
}
html[dir="rtl"] .splitToolbarButtonSeparator {
  float: right;
}

.toolbarButton,
.dropdownToolbarButton,
.secondaryToolbarButton,
.overlayButton {
  min-width: 16px;
  margin: 2px 1px;
  padding: 2px 6px 0;
  border: none;
  border-radius: 2px;
  color: var(--main-color);
  font-size: 12px;
  line-height: 14px;
  user-select: none;
  cursor: default;
  box-sizing: border-box;
}

html[dir="ltr"] #toolbarViewerLeft > .toolbarButton:first-child,
html[dir="rtl"] #toolbarViewerRight > .toolbarButton:last-child {
  margin-left: 2px;
}

html[dir="ltr"] #toolbarViewerRight > .toolbarButton:last-child,
html[dir="rtl"] #toolbarViewerLeft > .toolbarButton:first-child {
  margin-right: 2px;
}
.toolbarButton:hover,
.toolbarButton:focus {
  background-color: var(--button-hover-color);
}
.secondaryToolbarButton:hover,
.secondaryToolbarButton:focus {
  background-color: var(--doorhanger-hover-bg-color);
  color: var(--doorhanger-hover-color);
}

.toolbarButton.toggled,
.splitToolbarButton.toggled > .toolbarButton.toggled,
.secondaryToolbarButton.toggled {
  background-color: var(--toggled-btn-bg-color);
  color: var(--toggled-btn-color);
}

.secondaryToolbarButton.toggled::before {
  background-color: var(--toggled-btn-color);
}

.toolbarButton.toggled::before {
  background-color: var(--toggled-btn-color);
}

.toolbarButton.toggled:hover:active,
.splitToolbarButton.toggled > .toolbarButton.toggled:hover:active,
.secondaryToolbarButton.toggled:hover:active {
  background-color: var(--toggled-hover-active-btn-color);
}

.dropdownToolbarButton {
  width: 140px;
  padding: 0;
  overflow: hidden;
  background-color: var(--dropdown-btn-bg-color);
  margin-top: 2px !important;
}
.dropdownToolbarButton::after {
  top: 6px;
  pointer-events: none;

  mask-image: var(--toolbarButton-menuArrow-icon);
}
html[dir="ltr"] .dropdownToolbarButton::after {
  right: 7px;
}
html[dir="rtl"] .dropdownToolbarButton::after {
  left: 7px;
}

.dropdownToolbarButton > select {
  width: 162px;
  height: 28px;
  font-size: 12px;
  color: var(--main-color);
  margin: 0;
  padding: 1px 0 2px;
  border: none;
  background-color: var(--dropdown-btn-bg-color);
}
html[dir="ltr"] .dropdownToolbarButton > select {
  padding-left: 4px;
}
html[dir="rtl"] .dropdownToolbarButton > select {
  padding-right: 4px;
}
.dropdownToolbarButton > select:hover,
.dropdownToolbarButton > select:focus {
  background-color: var(--button-hover-color);
  color: var(--toggled-btn-color);
}

.dropdownToolbarButton > select > option {
  background: var(--doorhanger-bg-color);
  color: var(--main-color);
}

#customScaleOption {
  display: none;
}

#pageWidthOption {
  border-bottom: 1px rgba(255, 255, 255, 0.5) solid;
}

.toolbarButtonSpacer {
  width: 30px;
  display: inline-block;
  height: 1px;
}

.toolbarButton::before,
.secondaryToolbarButton::before,
.dropdownToolbarButton::after,
.treeItemToggler::before {
  /* All matching images have a size of 16x16
   * All relevant containers have a size of 28x28 */
  position: absolute;
  display: inline-block;
  width: 16px;
  height: 16px;

  content: "";
  background-color: var(--toolbar-icon-bg-color);
  mask-size: cover;
}

.dropdownToolbarButton:hover::after,
.dropdownToolbarButton:focus::after,
.dropdownToolbarButton:active::after {
  background-color: var(--toolbar-icon-hover-bg-color);
}

.toolbarButton::before {
  opacity: var(--toolbar-icon-opacity);
  top: 6px;
  left: 6px;
}

.toolbarButton:hover::before,
.toolbarButton:focus::before,
.secondaryToolbarButton:hover::before,
.secondaryToolbarButton:focus::before {
  background-color: var(--toolbar-icon-hover-bg-color);
}

.secondaryToolbarButton::before {
  opacity: var(--doorhanger-icon-opacity);
  top: 5px;
}
html[dir="ltr"] .secondaryToolbarButton::before {
  left: 12px;
}
html[dir="rtl"] .secondaryToolbarButton::before {
  right: 12px;
}

.toolbarButton#sidebarToggle::before {
  mask-image: var(--toolbarButton-sidebarToggle-icon);
}
html[dir="rtl"] .toolbarButton#sidebarToggle::before {
  transform: scaleX(-1);
}

.toolbarButton#secondaryToolbarToggle::before {
  mask-image: var(--toolbarButton-secondaryToolbarToggle-icon);
}
html[dir="rtl"] .toolbarButton#secondaryToolbarToggle::before {
  transform: scaleX(-1);
}

.toolbarButton.findPrevious::before {
  mask-image: var(--findbarButton-previous-icon);
}

.toolbarButton.findNext::before {
  mask-image: var(--findbarButton-next-icon);
}

.toolbarButton.pageUp::before {
  mask-image: var(--toolbarButton-pageUp-icon);
}

.toolbarButton.pageDown::before {
  mask-image: var(--toolbarButton-pageDown-icon);
}

.toolbarButton.zoomOut::before {
  mask-image: var(--toolbarButton-zoomOut-icon);
}

.toolbarButton.zoomIn::before {
  mask-image: var(--toolbarButton-zoomIn-icon);
}

.toolbarButton.presentationMode::before,
.secondaryToolbarButton.presentationMode::before {
  mask-image: var(--toolbarButton-presentationMode-icon);
}

.toolbarButton.print::before,
.secondaryToolbarButton.print::before {
  mask-image: var(--toolbarButton-print-icon);
}

.toolbarButton.openFile::before,
.secondaryToolbarButton.openFile::before {
  mask-image: var(--toolbarButton-openFile-icon);
}

.toolbarButton.download::before,
.secondaryToolbarButton.download::before {
  mask-image: var(--toolbarButton-download-icon);
}

.secondaryToolbarButton.bookmark {
  padding-top: 6px;
  text-decoration: none;
}

.bookmark[href="#"] {
  opacity: 0.5;
  pointer-events: none;
}

.toolbarButton.bookmark::before,
.secondaryToolbarButton.bookmark::before {
  mask-image: var(--toolbarButton-bookmark-icon);
}

#viewThumbnail.toolbarButton::before {
  mask-image: var(--toolbarButton-viewThumbnail-icon);
}

#viewOutline.toolbarButton::before {
  mask-image: var(--toolbarButton-viewOutline-icon);
}
html[dir="rtl"] #viewOutline.toolbarButton::before {
  transform: scaleX(-1);
}

#viewAttachments.toolbarButton::before {
  mask-image: var(--toolbarButton-viewAttachments-icon);
}

#viewLayers.toolbarButton::before {
  mask-image: var(--toolbarButton-viewLayers-icon);
}

#currentOutlineItem.toolbarButton::before {
  mask-image: var(--toolbarButton-currentOutlineItem-icon);
}
html[dir="rtl"] #currentOutlineItem.toolbarButton::before {
  transform: scaleX(-1);
}

#viewFind.toolbarButton::before {
  mask-image: var(--toolbarButton-search-icon);
}

.toolbarButton.pdfSidebarNotification::after {
  position: absolute;
  display: inline-block;
  top: 1px;
  /* Create a filled circle, with a diameter of 9 pixels, using only CSS: */
  content: "";
  background-color: rgba(112, 219, 85, 1);
  height: 9px;
  width: 9px;
  border-radius: 50%;
}
html[dir="ltr"] .toolbarButton.pdfSidebarNotification::after {
  left: 17px;
}
html[dir="rtl"] .toolbarButton.pdfSidebarNotification::after {
  right: 17px;
}

.secondaryToolbarButton {
  position: relative;
  margin: 0;
  padding: 0 0 1px;
  height: auto;
  min-height: 26px;
  width: auto;
  min-width: 100%;
  white-space: normal;
  border-radius: 0;
  box-sizing: border-box;
}
html[dir="ltr"] .secondaryToolbarButton {
  padding-left: 36px;
  text-align: left;
}
html[dir="rtl"] .secondaryToolbarButton {
  padding-right: 36px;
  text-align: right;
}

html[dir="ltr"] .secondaryToolbarButton > span {
  padding-right: 4px;
}
html[dir="rtl"] .secondaryToolbarButton > span {
  padding-left: 4px;
}

.secondaryToolbarButton.firstPage::before {
  mask-image: var(--secondaryToolbarButton-firstPage-icon);
}

.secondaryToolbarButton.lastPage::before {
  mask-image: var(--secondaryToolbarButton-lastPage-icon);
}

.secondaryToolbarButton.rotateCcw::before {
  mask-image: var(--secondaryToolbarButton-rotateCcw-icon);
}

.secondaryToolbarButton.rotateCw::before {
  mask-image: var(--secondaryToolbarButton-rotateCw-icon);
}

.secondaryToolbarButton.selectTool::before {
  mask-image: var(--secondaryToolbarButton-selectTool-icon);
}

.secondaryToolbarButton.handTool::before {
  mask-image: var(--secondaryToolbarButton-handTool-icon);
}

.secondaryToolbarButton.scrollVertical::before {
  mask-image: var(--secondaryToolbarButton-scrollVertical-icon);
}

.secondaryToolbarButton.scrollHorizontal::before {
  mask-image: var(--secondaryToolbarButton-scrollHorizontal-icon);
}

.secondaryToolbarButton.scrollWrapped::before {
  mask-image: var(--secondaryToolbarButton-scrollWrapped-icon);
}

.secondaryToolbarButton.spreadNone::before {
  mask-image: var(--secondaryToolbarButton-spreadNone-icon);
}

.secondaryToolbarButton.spreadOdd::before {
  mask-image: var(--secondaryToolbarButton-spreadOdd-icon);
}

.secondaryToolbarButton.spreadEven::before {
  mask-image: var(--secondaryToolbarButton-spreadEven-icon);
}

.secondaryToolbarButton.documentProperties::before {
  mask-image: var(--secondaryToolbarButton-documentProperties-icon);
}

.verticalToolbarSeparator {
  display: block;
  padding: 11px 0;
  margin: 5px 2px;
  width: 1px;
  background-color: var(--separator-color);
}
html[dir="ltr"] .verticalToolbarSeparator {
  margin-left: 2px;
}
html[dir="rtl"] .verticalToolbarSeparator {
  margin-right: 2px;
}

.horizontalToolbarSeparator {
  display: block;
  margin: 6px 0 5px;
  height: 1px;
  width: 100%;
  border-top: 1px solid var(--doorhanger-separator-color);
}

.toolbarField {
  padding: 4px 7px;
  margin: 3px 0;
  border-radius: 2px;
  background-color: var(--field-bg-color);
  background-clip: padding-box;
  border-width: 1px;
  border-style: solid;
  border-color: var(--field-border-color);
  box-shadow: none;
  color: var(--field-color);
  font-size: 12px;
  line-height: 16px;
  outline-style: none;
}

.toolbarField[type="checkbox"] {
  opacity: 0;
  position: absolute !important;
  left: 0;
}

html[dir="ltr"] .toolbarField[type="checkbox"] {
  margin: 10px 0 3px 7px;
}

html[dir="rtl"] .toolbarField[type="checkbox"] {
  margin: 10px 7px 3px 0;
}

.toolbarField.pageNumber {
  -moz-appearance: textfield; /* hides the spinner in moz */
  min-width: 16px;
  text-align: right;
  width: 40px;
}

.toolbarField.pageNumber.visiblePageIsLoading {
  background-image: var(--loading-icon);
  background-repeat: no-repeat;
  background-position: 3px;
}

.toolbarField:focus {
  border-color: #0a84ff;
}

.toolbarLabel {
  min-width: 16px;
  padding: 7px;
  margin: 2px;
  border-radius: 2px;
  color: var(--main-color);
  font-size: 12px;
  line-height: 14px;
  text-align: left;
  user-select: none;
  cursor: default;
}

html[dir="ltr"] #numPages.toolbarLabel {
  padding-left: 3px;
}
html[dir="rtl"] #numPages.toolbarLabel {
  padding-right: 3px;
}

#thumbnailView {
  position: absolute;
  width: calc(100% - 60px);
  top: 0;
  bottom: 0;
  padding: 10px 30px 0;
  overflow: auto;
}

#thumbnailView > a:active,
#thumbnailView > a:focus {
  outline: 0;
}

.thumbnail {
  margin: 0 10px 5px;
}
html[dir="ltr"] .thumbnail {
  float: left;
}
html[dir="rtl"] .thumbnail {
  float: right;
}

#thumbnailView > a:last-of-type > .thumbnail {
  margin-bottom: 10px;
}

#thumbnailView > a:last-of-type > .thumbnail:not([data-loaded]) {
  margin-bottom: 9px;
}

.thumbnail:not([data-loaded]) {
  border: 1px dashed rgba(132, 132, 132, 1);
  margin: -1px 9px 4px;
}

.thumbnailImage {
  border: 1px solid rgba(0, 0, 0, 0);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3);
  opacity: 0.8;
  z-index: 99;
  background-color: rgba(255, 255, 255, 1);
  background-clip: content-box;
}

.thumbnailSelectionRing {
  border-radius: 2px;
  padding: 7px;
}

a:focus > .thumbnail > .thumbnailSelectionRing > .thumbnailImage,
.thumbnail:hover > .thumbnailSelectionRing > .thumbnailImage {
  opacity: 0.9;
}

a:focus > .thumbnail > .thumbnailSelectionRing,
.thumbnail:hover > .thumbnailSelectionRing {
  background-color: var(--sidebaritem-bg-color);
  background-clip: padding-box;
  color: rgba(255, 255, 255, 0.9);
}

.thumbnail.selected > .thumbnailSelectionRing > .thumbnailImage {
  opacity: 1;
}

.thumbnail.selected > .thumbnailSelectionRing {
  background-color: var(--sidebaritem-bg-color);
  background-clip: padding-box;
  color: rgba(255, 255, 255, 1);
}

#outlineView,
#attachmentsView,
#layersView {
  position: absolute;
  width: calc(100% - 8px);
  top: 0;
  bottom: 0;
  padding: 4px 4px 0;
  overflow: auto;
  user-select: none;
}

html[dir="ltr"] .treeWithDeepNesting > .treeItem,
html[dir="ltr"] .treeItem > .treeItems {
  margin-left: 20px;
}

html[dir="rtl"] .treeWithDeepNesting > .treeItem,
html[dir="rtl"] .treeItem > .treeItems {
  margin-right: 20px;
}

.treeItem > a {
  text-decoration: none;
  display: inline-block;
  min-width: 95%;
  /* Subtract the right padding (left, in RTL mode) of the container: */
  min-width: calc(100% - 4px);
  height: auto;
  margin-bottom: 1px;
  border-radius: 2px;
  color: var(--treeitem-color);
  font-size: 13px;
  line-height: 15px;
  user-select: none;
  white-space: normal;
  cursor: pointer;
}
html[dir="ltr"] .treeItem > a {
  padding: 2px 0 5px 4px;
}
html[dir="rtl"] .treeItem > a {
  padding: 2px 4px 5px 0;
}

#layersView .treeItem > a > * {
  cursor: pointer;
}
html[dir="ltr"] #layersView .treeItem > a > label {
  padding-left: 4px;
}
html[dir="rtl"] #layersView .treesItem > a > label {
  padding-right: 4px;
}

.treeItemToggler {
  position: relative;
  height: 0;
  width: 0;
  color: rgba(255, 255, 255, 0.5);
}
.treeItemToggler::before {
  mask-image: var(--treeitem-expanded-icon);
}
.treeItemToggler.treeItemsHidden::before {
  mask-image: var(--treeitem-collapsed-icon);
}
html[dir="rtl"] .treeItemToggler.treeItemsHidden::before {
  transform: scaleX(-1);
}
.treeItemToggler.treeItemsHidden ~ .treeItems {
  display: none;
}
html[dir="ltr"] .treeItemToggler {
  float: left;
}
html[dir="rtl"] .treeItemToggler {
  float: right;
}
html[dir="ltr"] .treeItemToggler::before {
  right: 4px;
}
html[dir="rtl"] .treeItemToggler::before {
  left: 4px;
}

.treeItem.selected > a {
  background-color: var(--treeitem-selected-bg-color);
  color: var(--treeitem-selected-color);
}

.treeItemToggler:hover,
.treeItemToggler:hover + a,
.treeItemToggler:hover ~ .treeItems,
.treeItem > a:hover {
  background-color: var(--sidebaritem-bg-color);
  background-clip: padding-box;
  border-radius: 2px;
  color: var(--treeitem-hover-color);
}

/* TODO: file FF bug to support ::-moz-selection:window-inactive
   so we can override the opaque grey background when the window is inactive;
   see https://bugzilla.mozilla.org/show_bug.cgi?id=706209 */
::selection {
  background: rgba(0, 0, 255, 0.3);
}

#errorWrapper {
  background: none repeat scroll 0 0 var(--errorWrapper-bg-color);
  color: var(--main-color);
  left: 0;
  position: absolute;
  right: 0;
  z-index: 1000;
  padding: 3px 6px;
}

#errorMessageLeft {
  float: left;
}

#errorMessageRight {
  float: right;
}

#errorMoreInfo {
  background-color: var(--field-bg-color);
  color: var(--field-color);
  border: 1px solid var(--field-border-color);
  padding: 3px;
  margin: 3px;
  width: 98%;
}

.overlayButton {
  width: auto;
  margin: 3px 4px 2px !important;
  padding: 2px 11px;
  color: var(--main-color);
  background-color: var(--overlay-button-bg-color);
  border: var(--overlay-button-border) !important;
}

#overlayContainer {
  display: table;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 40000;
}
#overlayContainer > * {
  overflow: auto;
}

#overlayContainer > .container {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}

#overlayContainer > .container > .dialog {
  display: inline-block;
  padding: 15px;
  border-spacing: 4px;
  color: var(--main-color);
  font-size: 12px;
  line-height: 14px;
  background-color: var(--doorhanger-bg-color);
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.dialog > .row {
  display: table-row;
}

.dialog > .row > * {
  display: table-cell;
}

.dialog .toolbarField {
  margin: 5px 0;
}

.dialog .separator {
  display: block;
  margin: 4px 0;
  height: 1px;
  width: 100%;
  background-color: var(--separator-color);
}

.dialog .buttonRow {
  text-align: center;
  vertical-align: middle;
}

.dialog :link {
  color: rgba(255, 255, 255, 1);
}

#passwordOverlay > .dialog {
  text-align: center;
}
#passwordOverlay .toolbarField {
  width: 200px;
}

#documentPropertiesOverlay > .dialog {
  text-align: left;
}
#documentPropertiesOverlay .row > * {
  min-width: 100px;
}
html[dir="ltr"] #documentPropertiesOverlay .row > * {
  text-align: left;
}
html[dir="rtl"] #documentPropertiesOverlay .row > * {
  text-align: right;
}
#documentPropertiesOverlay .row > span {
  width: 125px;
  word-wrap: break-word;
}
#documentPropertiesOverlay .row > p {
  max-width: 225px;
  word-wrap: break-word;
}
#documentPropertiesOverlay .buttonRow {
  margin-top: 10px;
}

.clearBoth {
  clear: both;
}

.fileInput {
  background: rgba(255, 255, 255, 1);
  color: rgba(0, 0, 0, 1);
  margin-top: 5px;
  visibility: hidden;
  position: fixed;
  right: 0;
  top: 0;
}

#PDFBug {
  background: none repeat scroll 0 0 rgba(255, 255, 255, 1);
  border: 1px solid rgba(102, 102, 102, 1);
  position: fixed;
  top: 32px;
  right: 0;
  bottom: 0;
  font-size: 10px;
  padding: 0;
  width: 300px;
}
#PDFBug .controls {
  background: rgba(238, 238, 238, 1);
  border-bottom: 1px solid rgba(102, 102, 102, 1);
  padding: 3px;
}
#PDFBug .panels {
  bottom: 0;
  left: 0;
  overflow: auto;
  position: absolute;
  right: 0;
  top: 27px;
}
#PDFBug .panels > div {
  padding: 5px;
}
#PDFBug button.active {
  font-weight: bold;
}
.debuggerShowText {
  background: none repeat scroll 0 0 rgba(255, 255, 0, 1);
  color: rgba(0, 0, 255, 1);
}
.debuggerHideText:hover {
  background: none repeat scroll 0 0 rgba(255, 255, 0, 1);
}
#PDFBug .stats {
  font-family: courier;
  font-size: 10px;
  white-space: pre;
}
#PDFBug .stats .title {
  font-weight: bold;
}
#PDFBug table {
  font-size: 10px;
}

#viewer.textLayer-visible .textLayer {
  opacity: 1;
}

#viewer.textLayer-visible .canvasWrapper {
  background-color: rgba(128, 255, 128, 1);
}

#viewer.textLayer-visible .canvasWrapper canvas {
  mix-blend-mode: screen;
}

#viewer.textLayer-visible .textLayer span {
  background-color: rgba(255, 255, 0, 0.1);
  color: rgba(0, 0, 0, 1);
  border: solid 1px rgba(255, 0, 0, 0.5);
  box-sizing: border-box;
}

#viewer.textLayer-hover .textLayer span:hover {
  background-color: rgba(255, 255, 255, 1);
  color: rgba(0, 0, 0, 1);
}

#viewer.textLayer-shadow .textLayer span {
  background-color: rgba(255, 255, 255, 0.6);
  color: rgba(0, 0, 0, 1);
}

.grab-to-pan-grab {
  cursor: url("images/grab.cur"), move !important;
  cursor: grab !important;
}
.grab-to-pan-grab
  *:not(input):not(textarea):not(button):not(select):not(:link) {
  cursor: inherit !important;
}
.grab-to-pan-grab:active,
.grab-to-pan-grabbing {
  cursor: url("images/grabbing.cur"), move !important;
  cursor: grabbing !important;
  position: fixed;
  background: rgba(0, 0, 0, 0);
  display: block;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 50000; /* should be higher than anything else in PDF.js! */
}

@page {
  margin: 0;
}

#printContainer {
  display: none;
}

@media print {
  /* General rules for printing. */
  body {
    background: rgba(0, 0, 0, 0) none;
  }

  /* Rules for browsers that don't support mozPrintCallback. */
  #sidebarContainer,
  #secondaryToolbar,
  .toolbar,
  #loadingBox,
  #errorWrapper,
  .textLayer {
    display: none;
  }
  #viewerContainer {
    overflow: visible;
  }

  #mainContainer,
  #viewerContainer,
  .page,
  .page canvas {
    position: static;
    padding: 0;
    margin: 0;
  }

  .page {
    float: left;
    display: none;
    border: none;
    box-shadow: none;
    background-clip: content-box;
    background-color: rgba(255, 255, 255, 1);
  }

  .page[data-loaded] {
    display: block;
  }

  .fileInput {
    display: none;
  }

  /* Rules for browsers that support PDF.js printing */
  body[data-pdfjsprinting] #outerContainer {
    display: none;
  }
  body[data-pdfjsprinting] #printContainer {
    display: block;
  }
  #printContainer {
    height: 100%;
  }
  /* wrapper around (scaled) print canvas elements */
  #printContainer > div {
    page-break-after: always;
    page-break-inside: avoid;

    /* The wrapper always cover the whole page. */
    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  #printContainer canvas,
  #printContainer img {
    /* The intrinsic canvas / image size will make sure that we fit the page. */
    max-width: 100%;
    max-height: 100%;

    direction: ltr;
    display: block;
  }
}

.visibleLargeView,
.visibleMediumView,
.visibleSmallView {
  display: none;
}

@media all and (max-width: 900px) {
  #toolbarViewerMiddle {
    display: table;
    margin: auto;
    left: auto;
    position: inherit;
    transform: none;
  }
}

@media all and (max-width: 840px) {
  #sidebarContainer {
    background-color: var(--sidebar-narrow-bg-color);
  }

  html[dir="ltr"] #outerContainer.sidebarOpen #viewerContainer {
    left: 0 !important;
  }
  html[dir="rtl"] #outerContainer.sidebarOpen #viewerContainer {
    right: 0 !important;
  }

  #outerContainer .hiddenLargeView,
  #outerContainer .hiddenMediumView {
    display: inherit;
  }
  #outerContainer .visibleLargeView,
  #outerContainer .visibleMediumView {
    display: none;
  }
}

@media all and (max-width: 770px) {
  #outerContainer .hiddenLargeView {
    display: none;
  }
  #outerContainer .visibleLargeView {
    display: inherit;
  }
}

@media all and (max-width: 700px) {
  #outerContainer .hiddenMediumView {
    display: none;
  }
  #outerContainer .visibleMediumView {
    display: inherit;
  }
}

@media all and (max-width: 640px) {
  .hiddenSmallView,
  .hiddenSmallView * {
    display: none;
  }
  .visibleSmallView {
    display: inherit;
  }
  .toolbarButtonSpacer {
    width: 0;
  }
  html[dir="ltr"] .findbar {
    left: 34px;
  }
  html[dir="rtl"] .findbar {
    right: 34px;
  }
}

@media all and (max-width: 535px) {
  #scaleSelectContainer {
    display: none;
  }
}
PK
       !<Ÿ¤ÙvP  vP  $   chrome/pdfjs/content/web/viewer.htmlï»¿<!DOCTYPE html>
<!--
Copyright 2012 Mozilla Foundation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Adobe CMap resources are covered by their own copyright but the same license:

    Copyright 1990-2015 Adobe Systems Incorporated.

See https://github.com/adobe-type-tools/cmap-resources
-->
<html dir="ltr" mozdisallowselectionprint>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>PDF.js viewer</title>

<!-- This snippet is used in the Firefox extension (included from viewer.html) -->
<base href="resource://pdf.js/web/">
<script src="../build/pdf.js"></script>


    <link rel="stylesheet" href="viewer.css">



  <script src="viewer.js"></script>

  </head>

  <body tabindex="1">
    <div id="outerContainer">

      <div id="sidebarContainer">
        <div id="toolbarSidebar">
          <div id="toolbarSidebarLeft">
            <div class="splitToolbarButton toggled">
              <button id="viewThumbnail" class="toolbarButton toggled" title="Show Thumbnails" tabindex="2" data-l10n-id="thumbs">
                 <span data-l10n-id="thumbs_label">Thumbnails</span>
              </button>
              <button id="viewOutline" class="toolbarButton" title="Show Document Outline (double-click to expand/collapse all items)" tabindex="3" data-l10n-id="document_outline">
                 <span data-l10n-id="document_outline_label">Document Outline</span>
              </button>
              <button id="viewAttachments" class="toolbarButton" title="Show Attachments" tabindex="4" data-l10n-id="attachments">
                 <span data-l10n-id="attachments_label">Attachments</span>
              </button>
              <button id="viewLayers" class="toolbarButton" title="Show Layers (double-click to reset all layers to the default state)" tabindex="5" data-l10n-id="layers">
                 <span data-l10n-id="layers_label">Layers</span>
              </button>
            </div>
          </div>

          <div id="toolbarSidebarRight">
            <div id="outlineOptionsContainer" class="hidden">
              <div class="verticalToolbarSeparator"></div>

              <button id="currentOutlineItem" class="toolbarButton" disabled="disabled" title="Find Current Outline Item" tabindex="6" data-l10n-id="current_outline_item">
                <span data-l10n-id="current_outline_item_label">Current Outline Item</span>
              </button>
            </div>
          </div>
        </div>
        <div id="sidebarContent">
          <div id="thumbnailView">
          </div>
          <div id="outlineView" class="hidden">
          </div>
          <div id="attachmentsView" class="hidden">
          </div>
          <div id="layersView" class="hidden">
          </div>
        </div>
        <div id="sidebarResizer"></div>
      </div>  <!-- sidebarContainer -->

      <div id="mainContainer">
        <div class="findbar hidden doorHanger" id="findbar">
          <div id="findbarInputContainer">
            <input id="findInput" class="toolbarField" title="Find" placeholder="Find in documentâ€¦" tabindex="91" data-l10n-id="find_input">
            <div class="splitToolbarButton">
              <button id="findPrevious" class="toolbarButton findPrevious" title="Find the previous occurrence of the phrase" tabindex="92" data-l10n-id="find_previous">
                <span data-l10n-id="find_previous_label">Previous</span>
              </button>
              <div class="splitToolbarButtonSeparator"></div>
              <button id="findNext" class="toolbarButton findNext" title="Find the next occurrence of the phrase" tabindex="93" data-l10n-id="find_next">
                <span data-l10n-id="find_next_label">Next</span>
              </button>
            </div>
          </div>

          <div id="findbarOptionsOneContainer">
            <input type="checkbox" id="findHighlightAll" class="toolbarField" tabindex="94">
            <label for="findHighlightAll" class="toolbarLabel" data-l10n-id="find_highlight">Highlight all</label>
            <input type="checkbox" id="findMatchCase" class="toolbarField" tabindex="95">
            <label for="findMatchCase" class="toolbarLabel" data-l10n-id="find_match_case_label">Match case</label>
          </div>
          <div id="findbarOptionsTwoContainer">
            <input type="checkbox" id="findEntireWord" class="toolbarField" tabindex="96">
            <label for="findEntireWord" class="toolbarLabel" data-l10n-id="find_entire_word_label">Whole words</label>
            <span id="findResultsCount" class="toolbarLabel hidden"></span>
          </div>

          <div id="findbarMessageContainer">
            <span id="findMsg" class="toolbarLabel"></span>
          </div>
        </div>  <!-- findbar -->

        <div id="secondaryToolbar" class="secondaryToolbar hidden doorHangerRight">
          <div id="secondaryToolbarButtonContainer">
            <button id="secondaryPresentationMode" class="secondaryToolbarButton presentationMode visibleLargeView" title="Switch to Presentation Mode" tabindex="51" data-l10n-id="presentation_mode">
              <span data-l10n-id="presentation_mode_label">Presentation Mode</span>
            </button>

            <button id="secondaryOpenFile" class="secondaryToolbarButton openFile visibleLargeView" title="Open File" tabindex="52" data-l10n-id="open_file">
              <span data-l10n-id="open_file_label">Open</span>
            </button>

            <button id="secondaryPrint" class="secondaryToolbarButton print visibleMediumView" title="Print" tabindex="53" data-l10n-id="print">
              <span data-l10n-id="print_label">Print</span>
            </button>

            <button id="secondaryDownload" class="secondaryToolbarButton download visibleMediumView" title="Download" tabindex="54" data-l10n-id="download">
              <span data-l10n-id="download_label">Download</span>
            </button>

            <a href="#" id="secondaryViewBookmark" class="secondaryToolbarButton bookmark visibleSmallView" title="Current view (copy or open in new window)" tabindex="55" data-l10n-id="bookmark">
              <span data-l10n-id="bookmark_label">Current View</span>
            </a>

            <div class="horizontalToolbarSeparator visibleLargeView"></div>

            <button id="firstPage" class="secondaryToolbarButton firstPage" title="Go to First Page" tabindex="56" data-l10n-id="first_page">
              <span data-l10n-id="first_page_label">Go to First Page</span>
            </button>
            <button id="lastPage" class="secondaryToolbarButton lastPage" title="Go to Last Page" tabindex="57" data-l10n-id="last_page">
              <span data-l10n-id="last_page_label">Go to Last Page</span>
            </button>

            <div class="horizontalToolbarSeparator"></div>

            <button id="pageRotateCw" class="secondaryToolbarButton rotateCw" title="Rotate Clockwise" tabindex="58" data-l10n-id="page_rotate_cw">
              <span data-l10n-id="page_rotate_cw_label">Rotate Clockwise</span>
            </button>
            <button id="pageRotateCcw" class="secondaryToolbarButton rotateCcw" title="Rotate Counterclockwise" tabindex="59" data-l10n-id="page_rotate_ccw">
              <span data-l10n-id="page_rotate_ccw_label">Rotate Counterclockwise</span>
            </button>

            <div class="horizontalToolbarSeparator"></div>

            <button id="cursorSelectTool" class="secondaryToolbarButton selectTool toggled" title="Enable Text Selection Tool" tabindex="60" data-l10n-id="cursor_text_select_tool">
              <span data-l10n-id="cursor_text_select_tool_label">Text Selection Tool</span>
            </button>
            <button id="cursorHandTool" class="secondaryToolbarButton handTool" title="Enable Hand Tool" tabindex="61" data-l10n-id="cursor_hand_tool">
              <span data-l10n-id="cursor_hand_tool_label">Hand Tool</span>
            </button>

            <div class="horizontalToolbarSeparator"></div>

            <button id="scrollVertical" class="secondaryToolbarButton scrollModeButtons scrollVertical toggled" title="Use Vertical Scrolling" tabindex="62" data-l10n-id="scroll_vertical">
              <span data-l10n-id="scroll_vertical_label">Vertical Scrolling</span>
            </button>
            <button id="scrollHorizontal" class="secondaryToolbarButton scrollModeButtons scrollHorizontal" title="Use Horizontal Scrolling" tabindex="63" data-l10n-id="scroll_horizontal">
              <span data-l10n-id="scroll_horizontal_label">Horizontal Scrolling</span>
            </button>
            <button id="scrollWrapped" class="secondaryToolbarButton scrollModeButtons scrollWrapped" title="Use Wrapped Scrolling" tabindex="64" data-l10n-id="scroll_wrapped">
              <span data-l10n-id="scroll_wrapped_label">Wrapped Scrolling</span>
            </button>

            <div class="horizontalToolbarSeparator scrollModeButtons"></div>

            <button id="spreadNone" class="secondaryToolbarButton spreadModeButtons spreadNone toggled" title="Do not join page spreads" tabindex="65" data-l10n-id="spread_none">
              <span data-l10n-id="spread_none_label">No Spreads</span>
            </button>
            <button id="spreadOdd" class="secondaryToolbarButton spreadModeButtons spreadOdd" title="Join page spreads starting with odd-numbered pages" tabindex="66" data-l10n-id="spread_odd">
              <span data-l10n-id="spread_odd_label">Odd Spreads</span>
            </button>
            <button id="spreadEven" class="secondaryToolbarButton spreadModeButtons spreadEven" title="Join page spreads starting with even-numbered pages" tabindex="67" data-l10n-id="spread_even">
              <span data-l10n-id="spread_even_label">Even Spreads</span>
            </button>

            <div class="horizontalToolbarSeparator spreadModeButtons"></div>

            <button id="documentProperties" class="secondaryToolbarButton documentProperties" title="Document Propertiesâ€¦" tabindex="68" data-l10n-id="document_properties">
              <span data-l10n-id="document_properties_label">Document Propertiesâ€¦</span>
            </button>
          </div>
        </div>  <!-- secondaryToolbar -->

        <div class="toolbar">
          <div id="toolbarContainer">
            <div id="toolbarViewer">
              <div id="toolbarViewerLeft">
                <button id="sidebarToggle" class="toolbarButton" title="Toggle Sidebar" tabindex="11" data-l10n-id="toggle_sidebar" aria-expanded="false" aria-controls="sidebarContainer">
                  <span data-l10n-id="toggle_sidebar_label">Toggle Sidebar</span>
                </button>
                <div class="toolbarButtonSpacer"></div>
                <button id="viewFind" class="toolbarButton" title="Find in Document" tabindex="12" data-l10n-id="findbar" aria-expanded="false" aria-controls="findbar">
                  <span data-l10n-id="findbar_label">Find</span>
                </button>
                <div class="splitToolbarButton hiddenSmallView">
                  <button class="toolbarButton pageUp" title="Previous Page" id="previous" tabindex="13" data-l10n-id="previous">
                    <span data-l10n-id="previous_label">Previous</span>
                  </button>
                  <div class="splitToolbarButtonSeparator"></div>
                  <button class="toolbarButton pageDown" title="Next Page" id="next" tabindex="14" data-l10n-id="next">
                    <span data-l10n-id="next_label">Next</span>
                  </button>
                </div>
                <input type="number" id="pageNumber" class="toolbarField pageNumber" title="Page" value="1" size="4" min="1" tabindex="15" data-l10n-id="page" autocomplete="off">
                <span id="numPages" class="toolbarLabel"></span>
              </div>
              <div id="toolbarViewerRight">
                <button id="presentationMode" class="toolbarButton presentationMode hiddenLargeView" title="Switch to Presentation Mode" tabindex="31" data-l10n-id="presentation_mode">
                  <span data-l10n-id="presentation_mode_label">Presentation Mode</span>
                </button>

                <button id="openFile" class="toolbarButton openFile hiddenLargeView" title="Open File" tabindex="32" data-l10n-id="open_file">
                  <span data-l10n-id="open_file_label">Open</span>
                </button>

                <button id="print" class="toolbarButton print hiddenMediumView" title="Print" tabindex="33" data-l10n-id="print">
                  <span data-l10n-id="print_label">Print</span>
                </button>

                <button id="download" class="toolbarButton download hiddenMediumView" title="Download" tabindex="34" data-l10n-id="download">
                  <span data-l10n-id="download_label">Download</span>
                </button>
                <a href="#" id="viewBookmark" class="toolbarButton bookmark hiddenSmallView" title="Current view (copy or open in new window)" tabindex="35" data-l10n-id="bookmark">
                  <span data-l10n-id="bookmark_label">Current View</span>
                </a>

                <div class="verticalToolbarSeparator hiddenSmallView"></div>

                <button id="secondaryToolbarToggle" class="toolbarButton" title="Tools" tabindex="36" data-l10n-id="tools" aria-expanded="false" aria-controls="secondaryToolbar">
                  <span data-l10n-id="tools_label">Tools</span>
                </button>
              </div>
              <div id="toolbarViewerMiddle">
                <div class="splitToolbarButton">
                  <button id="zoomOut" class="toolbarButton zoomOut" title="Zoom Out" tabindex="21" data-l10n-id="zoom_out">
                    <span data-l10n-id="zoom_out_label">Zoom Out</span>
                  </button>
                  <div class="splitToolbarButtonSeparator"></div>
                  <button id="zoomIn" class="toolbarButton zoomIn" title="Zoom In" tabindex="22" data-l10n-id="zoom_in">
                    <span data-l10n-id="zoom_in_label">Zoom In</span>
                   </button>
                </div>
                <span id="scaleSelectContainer" class="dropdownToolbarButton">
                  <select id="scaleSelect" title="Zoom" tabindex="23" data-l10n-id="zoom">
                    <option id="pageAutoOption" title="" value="auto" selected="selected" data-l10n-id="page_scale_auto">Automatic Zoom</option>
                    <option id="pageActualOption" title="" value="page-actual" data-l10n-id="page_scale_actual">Actual Size</option>
                    <option id="pageFitOption" title="" value="page-fit" data-l10n-id="page_scale_fit">Page Fit</option>
                    <option id="pageWidthOption" title="" value="page-width" data-l10n-id="page_scale_width">Page Width</option>
                    <option id="customScaleOption" title="" value="custom" disabled="disabled" hidden="true"></option>
                    <option title="" value="0.5" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 50 }'>50%</option>
                    <option title="" value="0.75" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 75 }'>75%</option>
                    <option title="" value="1" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 100 }'>100%</option>
                    <option title="" value="1.25" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 125 }'>125%</option>
                    <option title="" value="1.5" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 150 }'>150%</option>
                    <option title="" value="2" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 200 }'>200%</option>
                    <option title="" value="3" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 300 }'>300%</option>
                    <option title="" value="4" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 400 }'>400%</option>
                  </select>
                </span>
              </div>
            </div>
            <div id="loadingBar">
              <div class="progress">
                <div class="glimmer">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="viewerContainer" tabindex="0">
          <div id="viewer" class="pdfViewer"></div>
        </div>

      </div> <!-- mainContainer -->

      <div id="overlayContainer" class="hidden">
        <div id="passwordOverlay" class="container hidden">
          <div class="dialog">
            <div class="row">
              <p id="passwordText" data-l10n-id="password_label">Enter the password to open this PDF file:</p>
            </div>
            <div class="row">
              <input type="password" id="password" class="toolbarField">
            </div>
            <div class="buttonRow">
              <button id="passwordCancel" class="overlayButton"><span data-l10n-id="password_cancel">Cancel</span></button>
              <button id="passwordSubmit" class="overlayButton"><span data-l10n-id="password_ok">OK</span></button>
            </div>
          </div>
        </div>
        <div id="documentPropertiesOverlay" class="container hidden">
          <div class="dialog">
            <div class="row">
              <span data-l10n-id="document_properties_file_name">File name:</span> <p id="fileNameField">-</p>
            </div>
            <div class="row">
              <span data-l10n-id="document_properties_file_size">File size:</span> <p id="fileSizeField">-</p>
            </div>
            <div class="separator"></div>
            <div class="row">
              <span data-l10n-id="document_properties_title">Title:</span> <p id="titleField">-</p>
            </div>
            <div class="row">
              <span data-l10n-id="document_properties_author">Author:</span> <p id="authorField">-</p>
            </div>
            <div class="row">
              <span data-l10n-id="document_properties_subject">Subject:</span> <p id="subjectField">-</p>
            </div>
            <div class="row">
              <span data-l10n-id="document_properties_keywords">Keywords:</span> <p id="keywordsField">-</p>
            </div>
            <div class="row">
              <span data-l10n-id="document_properties_creation_date">Creation Date:</span> <p id="creationDateField">-</p>
            </div>
            <div class="row">
              <span data-l10n-id="document_properties_modification_date">Modification Date:</span> <p id="modificationDateField">-</p>
            </div>
            <div class="row">
              <span data-l10n-id="document_properties_creator">Creator:</span> <p id="creatorField">-</p>
            </div>
            <div class="separator"></div>
            <div class="row">
              <span data-l10n-id="document_properties_producer">PDF Producer:</span> <p id="producerField">-</p>
            </div>
            <div class="row">
              <span data-l10n-id="document_properties_version">PDF Version:</span> <p id="versionField">-</p>
            </div>
            <div class="row">
              <span data-l10n-id="document_properties_page_count">Page Count:</span> <p id="pageCountField">-</p>
            </div>
            <div class="row">
              <span data-l10n-id="document_properties_page_size">Page Size:</span> <p id="pageSizeField">-</p>
            </div>
            <div class="separator"></div>
            <div class="row">
              <span data-l10n-id="document_properties_linearized">Fast Web View:</span> <p id="linearizedField">-</p>
            </div>
            <div class="buttonRow">
              <button id="documentPropertiesClose" class="overlayButton"><span data-l10n-id="document_properties_close">Close</span></button>
            </div>
          </div>
        </div>
      </div>  <!-- overlayContainer -->

    </div> <!-- outerContainer -->
    <div id="printContainer"></div>
  </body>
</html>
PK
       !<:¤§ë ë "   chrome/pdfjs/content/web/viewer.js/**
 * @licstart The following is the entire license notice for the
 * Javascript code in this page
 *
 * Copyright 2021 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @licend The above is the entire license notice for the
 * Javascript code in this page
 */

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.OptionKind = exports.AppOptions = void 0;

var _viewer_compatibility = __webpack_require__(2);

const OptionKind = {
  VIEWER: 0x02,
  API: 0x04,
  WORKER: 0x08,
  PREFERENCE: 0x80
};
exports.OptionKind = OptionKind;
const defaultOptions = {
  cursorToolOnLoad: {
    value: 0,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  defaultUrl: {
    value: "compressed.tracemonkey-pldi-09.pdf",
    kind: OptionKind.VIEWER
  },
  defaultZoomValue: {
    value: "",
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  disableHistory: {
    value: false,
    kind: OptionKind.VIEWER
  },
  disablePageLabels: {
    value: false,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  enablePermissions: {
    value: false,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  enablePrintAutoRotate: {
    value: true,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  enableScripting: {
    value: true,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  externalLinkRel: {
    value: "noopener noreferrer nofollow",
    kind: OptionKind.VIEWER
  },
  externalLinkTarget: {
    value: 0,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  historyUpdateUrl: {
    value: false,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  ignoreDestinationZoom: {
    value: false,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  imageResourcesPath: {
    value: "./images/",
    kind: OptionKind.VIEWER
  },
  maxCanvasPixels: {
    value: 16777216,
    compatibility: _viewer_compatibility.viewerCompatibilityParams.maxCanvasPixels,
    kind: OptionKind.VIEWER
  },
  pdfBugEnabled: {
    value: false,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  printResolution: {
    value: 150,
    kind: OptionKind.VIEWER
  },
  renderer: {
    value: "canvas",
    kind: OptionKind.VIEWER
  },
  renderInteractiveForms: {
    value: true,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  sidebarViewOnLoad: {
    value: -1,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  scrollModeOnLoad: {
    value: -1,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  spreadModeOnLoad: {
    value: -1,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  textLayerMode: {
    value: 1,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  useOnlyCssZoom: {
    value: false,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  viewerCssTheme: {
    value: 0,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  viewOnLoad: {
    value: 0,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  cMapPacked: {
    value: true,
    kind: OptionKind.API
  },
  cMapUrl: {
    value: "../web/cmaps/",
    kind: OptionKind.API
  },
  disableAutoFetch: {
    value: false,
    kind: OptionKind.API + OptionKind.PREFERENCE
  },
  disableFontFace: {
    value: false,
    kind: OptionKind.API + OptionKind.PREFERENCE
  },
  disableRange: {
    value: false,
    kind: OptionKind.API + OptionKind.PREFERENCE
  },
  disableStream: {
    value: false,
    kind: OptionKind.API + OptionKind.PREFERENCE
  },
  docBaseUrl: {
    value: "",
    kind: OptionKind.API
  },
  enableXfa: {
    value: false,
    kind: OptionKind.API + OptionKind.PREFERENCE
  },
  fontExtraProperties: {
    value: false,
    kind: OptionKind.API
  },
  isEvalSupported: {
    value: true,
    kind: OptionKind.API
  },
  maxImageSize: {
    value: -1,
    kind: OptionKind.API
  },
  pdfBug: {
    value: false,
    kind: OptionKind.API
  },
  verbosity: {
    value: 1,
    kind: OptionKind.API
  },
  workerPort: {
    value: null,
    kind: OptionKind.WORKER
  },
  workerSrc: {
    value: "../build/pdf.worker.js",
    kind: OptionKind.WORKER
  }
};
;
const userOptions = Object.create(null);

class AppOptions {
  constructor() {
    throw new Error("Cannot initialize AppOptions.");
  }

  static get(name) {
    const userOption = userOptions[name];

    if (userOption !== undefined) {
      return userOption;
    }

    const defaultOption = defaultOptions[name];

    if (defaultOption !== undefined) {
      return defaultOption.compatibility ?? defaultOption.value;
    }

    return undefined;
  }

  static getAll(kind = null) {
    const options = Object.create(null);

    for (const name in defaultOptions) {
      const defaultOption = defaultOptions[name];

      if (kind) {
        if ((kind & defaultOption.kind) === 0) {
          continue;
        }

        if (kind === OptionKind.PREFERENCE) {
          const value = defaultOption.value,
                valueType = typeof value;

          if (valueType === "boolean" || valueType === "string" || valueType === "number" && Number.isInteger(value)) {
            options[name] = value;
            continue;
          }

          throw new Error(`Invalid type for preference: ${name}`);
        }
      }

      const userOption = userOptions[name];
      options[name] = userOption !== undefined ? userOption : defaultOption.compatibility ?? defaultOption.value;
    }

    return options;
  }

  static set(name, value) {
    userOptions[name] = value;
  }

  static setAll(options) {
    for (const name in options) {
      userOptions[name] = options[name];
    }
  }

  static remove(name) {
    delete userOptions[name];
  }

}

exports.AppOptions = AppOptions;

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.viewerCompatibilityParams = void 0;
const compatibilityParams = Object.create(null);
;
const viewerCompatibilityParams = Object.freeze(compatibilityParams);
exports.viewerCompatibilityParams = viewerCompatibilityParams;

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PDFViewerApplication = exports.PDFPrintServiceFactory = exports.DefaultExternalServices = void 0;

var _ui_utils = __webpack_require__(4);

var _app_options = __webpack_require__(1);

var _pdfjsLib = __webpack_require__(5);

var _pdf_cursor_tools = __webpack_require__(6);

var _pdf_rendering_queue = __webpack_require__(8);

var _overlay_manager = __webpack_require__(9);

var _password_prompt = __webpack_require__(10);

var _pdf_attachment_viewer = __webpack_require__(11);

var _pdf_document_properties = __webpack_require__(13);

var _pdf_find_bar = __webpack_require__(14);

var _pdf_find_controller = __webpack_require__(15);

var _pdf_history = __webpack_require__(17);

var _pdf_layer_viewer = __webpack_require__(18);

var _pdf_link_service = __webpack_require__(19);

var _pdf_outline_viewer = __webpack_require__(20);

var _pdf_presentation_mode = __webpack_require__(21);

var _pdf_scripting_manager = __webpack_require__(22);

var _pdf_sidebar = __webpack_require__(23);

var _pdf_sidebar_resizer = __webpack_require__(24);

var _pdf_thumbnail_viewer = __webpack_require__(25);

var _pdf_viewer = __webpack_require__(27);

var _secondary_toolbar = __webpack_require__(35);

var _toolbar = __webpack_require__(37);

var _viewer_compatibility = __webpack_require__(2);

var _view_history = __webpack_require__(38);

const DEFAULT_SCALE_DELTA = 1.1;
const DISABLE_AUTO_FETCH_LOADING_BAR_TIMEOUT = 5000;
const FORCE_PAGES_LOADED_TIMEOUT = 10000;
const WHEEL_ZOOM_DISABLED_TIMEOUT = 1000;
const ENABLE_PERMISSIONS_CLASS = "enablePermissions";
const ViewOnLoad = {
  UNKNOWN: -1,
  PREVIOUS: 0,
  INITIAL: 1
};
const ViewerCssTheme = {
  AUTOMATIC: 0,
  LIGHT: 1,
  DARK: 2
};
const KNOWN_VERSIONS = ["1.0", "1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "1.8", "1.9", "2.0", "2.1", "2.2", "2.3"];
const KNOWN_GENERATORS = ["acrobat distiller", "acrobat pdfwriter", "adobe livecycle", "adobe pdf library", "adobe photoshop", "ghostscript", "tcpdf", "cairo", "dvipdfm", "dvips", "pdftex", "pdfkit", "itext", "prince", "quarkxpress", "mac os x", "microsoft", "openoffice", "oracle", "luradocument", "pdf-xchange", "antenna house", "aspose.cells", "fpdf"];

class DefaultExternalServices {
  constructor() {
    throw new Error("Cannot initialize DefaultExternalServices.");
  }

  static updateFindControlState(data) {}

  static updateFindMatchesCount(data) {}

  static initPassiveLoading(callbacks) {}

  static async fallback(data) {}

  static reportTelemetry(data) {}

  static createDownloadManager(options) {
    throw new Error("Not implemented: createDownloadManager");
  }

  static createPreferences() {
    throw new Error("Not implemented: createPreferences");
  }

  static createL10n(options) {
    throw new Error("Not implemented: createL10n");
  }

  static createScripting(options) {
    throw new Error("Not implemented: createScripting");
  }

  static get supportsIntegratedFind() {
    return (0, _pdfjsLib.shadow)(this, "supportsIntegratedFind", false);
  }

  static get supportsDocumentFonts() {
    return (0, _pdfjsLib.shadow)(this, "supportsDocumentFonts", true);
  }

  static get supportedMouseWheelZoomModifierKeys() {
    return (0, _pdfjsLib.shadow)(this, "supportedMouseWheelZoomModifierKeys", {
      ctrlKey: true,
      metaKey: true
    });
  }

  static get isInAutomation() {
    return (0, _pdfjsLib.shadow)(this, "isInAutomation", false);
  }

}

exports.DefaultExternalServices = DefaultExternalServices;
const PDFViewerApplication = {
  initialBookmark: document.location.hash.substring(1),
  _initializedCapability: (0, _pdfjsLib.createPromiseCapability)(),
  _fellback: false,
  appConfig: null,
  pdfDocument: null,
  pdfLoadingTask: null,
  printService: null,
  pdfViewer: null,
  pdfThumbnailViewer: null,
  pdfRenderingQueue: null,
  pdfPresentationMode: null,
  pdfDocumentProperties: null,
  pdfLinkService: null,
  pdfHistory: null,
  pdfSidebar: null,
  pdfSidebarResizer: null,
  pdfOutlineViewer: null,
  pdfAttachmentViewer: null,
  pdfLayerViewer: null,
  pdfCursorTools: null,
  pdfScriptingManager: null,
  store: null,
  downloadManager: null,
  overlayManager: null,
  preferences: null,
  toolbar: null,
  secondaryToolbar: null,
  eventBus: null,
  l10n: null,
  isInitialViewSet: false,
  downloadComplete: false,
  isViewerEmbedded: window.parent !== window,
  url: "",
  baseUrl: "",
  externalServices: DefaultExternalServices,
  _b