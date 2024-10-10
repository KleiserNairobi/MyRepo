ion)(attributes.name, ["full", "long", "med", "short"]);
  }

}

class TimePatterns extends _xfa_object.XFAObject {
  constructor(attributes) {
    super(LOCALE_SET_NS_ID, "timePatterns", true);
    this.timePattern = new _xfa_object.XFAObjectArray(4);
  }

}

class TypeFace extends _xfa_object.XFAObject {
  constructor(attributes) {
    super(LOCALE_SET_NS_ID, "typeFace", true);
    this.name = attributes.name | "";
  }

}

class TypeFaces extends _xfa_object.XFAObject {
  constructor(attributes) {
    super(LOCALE_SET_NS_ID, "typeFaces", true);
    this.typeFace = new _xfa_object.XFAObjectArray();
  }

}

class LocaleSetNamespace {
  static [_namespaces.$buildXFAObject](name, attributes) {
    if (LocaleSetNamespace.hasOwnProperty(name)) {
      return LocaleSetNamespace[name](attributes);
    }

    return undefined;
  }

  static calendarSymbols(attrs) {
    return new CalendarSymbols(attrs);
  }

  static currencySymbol(attrs) {
    return new CurrencySymbol(attrs);
  }

  static currencySymbols(attrs) {
    return new CurrencySymbols(attrs);
  }

  static datePattern(attrs) {
    return new DatePattern(attrs);
  }

  static datePatterns(attrs) {
    return new DatePatterns(attrs);
  }

  static dateTimeSymbols(attrs) {
    return new DateTimeSymbols(attrs);
  }

  static day(attrs) {
    return new Day(attrs);
  }

  static dayNames(attrs) {
    return new DayNames(attrs);
  }

  static era(attrs) {
    return new Era(attrs);
  }

  static eraNames(attrs) {
    return new EraNames(attrs);
  }

  static locale(attrs) {
    return new Locale(attrs);
  }

  static localeSet(attrs) {
    return new LocaleSet(attrs);
  }

  static meridiem(attrs) {
    return new Meridiem(attrs);
  }

  static meridiemNames(attrs) {
    return new MeridiemNames(attrs);
  }

  static month(attrs) {
    return new Month(attrs);
  }

  static monthNames(attrs) {
    return new MonthNames(attrs);
  }

  static numberPattern(attrs) {
    return new NumberPattern(attrs);
  }

  static numberPatterns(attrs) {
    return new NumberPatterns(attrs);
  }

  static numberSymbol(attrs) {
    return new NumberSymbol(attrs);
  }

  static numberSymbols(attrs) {
    return new NumberSymbols(attrs);
  }

  static timePattern(attrs) {
    return new TimePattern(attrs);
  }

  static timePatterns(attrs) {
    return new TimePatterns(attrs);
  }

  static typeFace(attrs) {
    return new TypeFace(attrs);
  }

  static typeFaces(attrs) {
    return new TypeFaces(attrs);
  }

}

exports.LocaleSetNamespace = LocaleSetNamespace;

/***/ }),
/* 82 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SignatureNamespace = void 0;

var _namespaces = __w_pdfjs_require__(70);

var _xfa_object = __w_pdfjs_require__(68);

const SIGNATURE_NS_ID = _namespaces.NamespaceIds.signature.id;

class Signature extends _xfa_object.XFAObject {
  constructor(attributes) {
    super(SIGNATURE_NS_ID, "signature", true);
  }

}

class SignatureNamespace {
  static [_namespaces.$buildXFAObject](name, attributes) {
    if (SignatureNamespace.hasOwnProperty(name)) {
      return SignatureNamespace[name](attributes);
    }

    return undefined;
  }

  static signature(attributes) {
    return new Signature(attributes);
  }

}

exports.SignatureNamespace = SignatureNamespace;

/***/ }),
/* 83 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.StylesheetNamespace = void 0;

var _namespaces = __w_pdfjs_require__(70);

var _xfa_object = __w_pdfjs_require__(68);

const STYLESHEET_NS_ID = _namespaces.NamespaceIds.stylesheet.id;

class Stylesheet extends _xfa_object.XFAObject {
  constructor(attributes) {
    super(STYLESHEET_NS_ID, "stylesheet", true);
  }

}

class StylesheetNamespace {
  static [_namespaces.$buildXFAObject](name, attributes) {
    if (StylesheetNamespace.hasOwnProperty(name)) {
      return StylesheetNamespace[name](attributes);
    }

    return undefined;
  }

  static stylesheet(attributes) {
    return new Stylesheet(attributes);
  }

}

exports.StylesheetNamespace = StylesheetNamespace;

/***/ }),
/* 84 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.XdpNamespace = void 0;

var _namespaces = __w_pdfjs_require__(70);

var _xfa_object = __w_pdfjs_require__(68);

const XDP_NS_ID = _namespaces.NamespaceIds.xdp.id;

class Xdp extends _xfa_object.XFAObject {
  constructor(attributes) {
    super(XDP_NS_ID, "xdp", true);
    this.uuid = attributes.uuid || "";
    this.timeStamp = attributes.timeStamp || "";
    this.config = null;
    this.connectionSet = null;
    this.datasets = null;
    this.localeSet = null;
    this.stylesheet = new _xfa_object.XFAObjectArray();
    this.template = null;
  }

  [_xfa_object.$onChildCheck](child) {
    const ns = _namespaces.NamespaceIds[child[_xfa_object.$nodeName]];
    return ns && child[_xfa_object.$namespaceId] === ns.id;
  }

}

class XdpNamespace {
  static [_namespaces.$buildXFAObject](name, attributes) {
    if (XdpNamespace.hasOwnProperty(name)) {
      return XdpNamespace[name](attributes);
    }

    return undefined;
  }

  static xdp(attributes) {
    return new Xdp(attributes);
  }

}

exports.XdpNamespace = XdpNamespace;

/***/ }),
/* 85 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.XhtmlNamespace = void 0;

var _xfa_object = __w_pdfjs_require__(68);

var _namespaces = __w_pdfjs_require__(70);

var _utils = __w_pdfjs_require__(69);

var _html_utils = __w_pdfjs_require__(73);

const XHTML_NS_ID = _namespaces.NamespaceIds.xhtml.id;
const VALID_STYLES = new Set(["color", "font", "font-family", "font-size", "font-stretch", "font-style", "font-weight", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "letter-spacing", "line-height", "orphans", "page-break-after", "page-break-before", "page-break-inside", "tab-interval", "tab-stop", "text-align", "text-decoration", "text-indent", "vertical-align", "widows", "kerning-mode", "xfa-font-horizontal-scale", "xfa-font-vertical-scale", "xfa-spacerun", "xfa-tab-stops"]);
const StyleMapping = new Map([["page-break-after", "breakAfter"], ["page-break-before", "breakBefore"], ["page-break-inside", "breakInside"], ["kerning-mode", value => value === "none" ? "none" : "normal"], ["xfa-font-horizontal-scale", value => `scaleX(${Math.max(0, Math.min(parseInt(value) / 100)).toFixed(2)})`], ["xfa-font-vertical-scale", value => `scaleY(${Math.max(0, Math.min(parseInt(value) / 100)).toFixed(2)})`], ["xfa-spacerun", ""], ["xfa-tab-stops", ""], ["font-size", value => (0, _html_utils.measureToString)((0, _utils.getMeasurement)(value))], ["letter-spacing", value => (0, _html_utils.measureToString)((0, _utils.getMeasurement)(value))], ["line-height", value => (0, _html_utils.measureToString)((0, _utils.getMeasurement)(value))], ["margin", value => (0, _html_utils.measureToString)((0, _utils.getMeasurement)(value))], ["margin-bottom", value => (0, _html_utils.measureToString)((0, _utils.getMeasurement)(value))], ["margin-left", value => (0, _html_utils.measureToString)((0, _utils.getMeasurement)(value))], ["margin-right", value => (0, _html_utils.measureToString)((0, _utils.getMeasurement)(value))], ["margin-top", value => (0, _html_utils.measureToString)((0, _utils.getMeasurement)(value))]]);
const spacesRegExp = /\s+/g;
const crlfRegExp = /[\r\n]+/g;

function mapStyle(styleStr) {
  const style = Object.create(null);

  if (!styleStr) {
    return style;
  }

  for (const [key, value] of styleStr.split(";").map(s => s.split(":", 2))) {
    const mapping = StyleMapping.get(key);

    if (mapping === "") {
      continue;
    }

    let newValue = value;

    if (mapping) {
      if (typeof mapping === "string") {
        newValue = mapping;
      } else {
        newValue = mapping(value);
      }
    }

    if (key.endsWith("scale")) {
      if (style.transform) {
        style.transform = `${style[key]} ${newValue}`;
      } else {
        style.transform = newValue;
      }
    } else {
      style[key.replaceAll(/-([a-zA-Z])/g, (_, x) => x.toUpperCase())] = newValue;
    }
  }

  return style;
}

function checkStyle(style) {
  if (!style) {
    return "";
  }

  return style.trim().split(/\s*;\s*/).filter(s => !!s).map(s => s.split(/\s*:\s*/, 2)).filter(([key]) => VALID_STYLES.has(key)).map(kv => kv.join(":")).join(";");
}

const NoWhites = new Set(["body", "html"]);

class XhtmlObject extends _xfa_object.XmlObject {
  constructor(attributes, name) {
    super(XHTML_NS_ID, name);
    this.style = checkStyle(attributes.style);
  }

  [_xfa_object.$acceptWhitespace]() {
    return !NoWhites.has(this[_xfa_object.$nodeName]);
  }

  [_xfa_object.$onText](str) {
    str = str.replace(crlfRegExp, "");

    if (!this.style.includes("xfa-spacerun:yes")) {
      str = str.replace(spacesRegExp, " ");
    }

    if (str) {
      this[_xfa_object.$content] += str;
    }
  }

  [_xfa_object.$toHTML]() {
    return {
      name: this[_xfa_object.$nodeName],
      attributes: {
        href: this.href,
        style: mapStyle(this.style)
      },
      children: this[_xfa_object.$childrenToHTML]({}),
      value: this[_xfa_object.$content] || ""
    };
  }

}

class A extends XhtmlObject {
  constructor(attributes) {
    super(attributes, "a");
    this.href = attributes.href || "";
  }

}

class B extends XhtmlObject {
  constructor(attributes) {
    super(attributes, "b");
  }

}

class Body extends XhtmlObject {
  constructor(attributes) {
    super(attributes, "body");
  }

  [_xfa_object.$toHTML]() {
    const html = super[_xfa_object.$toHTML]();

    html.attributes.class = "xfaRich";
    return html;
  }

}

class Br extends XhtmlObject {
  constructor(attributes) {
    super(attributes, "br");
  }

  [_xfa_object.$text]() {
    return "\n";
  }

  [_xfa_object.$toHTML]() {
    return {
      name: "br"
    };
  }

}

class Html extends XhtmlObject {
  constructor(attributes) {
    super(attributes, "html");
  }

  [_xfa_object.$toHTML]() {
    const children = this[_xfa_object.$childrenToHTML]({});

    if (children.length === 0) {
      return {
        name: "div",
        attributes: {
          class: "xfaRich",
          style: {}
        },
        value: this[_xfa_object.$content] || ""
      };
    }

    if (children.length === 1) {
      const child = children[0];

      if (child.attributes && child.attributes.class === "xfaRich") {
        return child;
      }
    }

    return {
      name: "div",
      attributes: {
        class: "xfaRich",
        style: {}
      },
      children
    };
  }

}

class I extends XhtmlObject {
  constructor(attributes) {
    super(attributes, "i");
  }

}

class Li extends XhtmlObject {
  constructor(attributes) {
    super(attributes, "li");
  }

}

class Ol extends XhtmlObject {
  constructor(attributes) {
    super(attributes, "ol");
  }

}

class P extends XhtmlObject {
  constructor(attributes) {
    super(attributes, "p");
  }

}

class Span extends XhtmlObject {
  constructor(attributes) {
    super(attributes, "span");
  }

}

class Sub extends XhtmlObject {
  constructor(attributes) {
    super(attributes, "sub");
  }

}

class Sup extends XhtmlObject {
  constructor(attributes) {
    super(attributes, "sup");
  }

}

class Ul extends XhtmlObject {
  constructor(attributes) {
    super(attributes, "ul");
  }

}

class XhtmlNamespace {
  static [_namespaces.$buildXFAObject](name, attributes) {
    if (XhtmlNamespace.hasOwnProperty(name)) {
      return XhtmlNamespace[name](attributes);
    }

    return undefined;
  }

  static a(attributes) {
    return new A(attributes);
  }

  static b(attributes) {
    return new B(attributes);
  }

  static body(attributes) {
    return new Body(attributes);
  }

  static br(attributes) {
    return new Br(attributes);
  }

  static html(attributes) {
    return new Html(attributes);
  }

  static i(attributes) {
    return new I(attributes);
  }

  static li(attributes) {
    return new Li(attributes);
  }

  static ol(attributes) {
    return new Ol(attributes);
  }

  static p(attributes) {
    return new P(attributes);
  }

  static span(attributes) {
    return new Span(attributes);
  }

  static sub(attributes) {
    return new Sub(attributes);
  }

  static sup(attributes) {
    return new Sup(attributes);
  }

  static ul(attributes) {
    return new Ul(attributes);
  }

}

exports.XhtmlNamespace = XhtmlNamespace;

/***/ }),
/* 86 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.UnknownNamespace = void 0;

var _namespaces = __w_pdfjs_require__(70);

var _xfa_object = __w_pdfjs_require__(68);

class UnknownNamespace {
  constructor(nsId) {
    this.namespaceId = nsId;
  }

  [_namespaces.$buildXFAObject](name, attributes) {
    return new _xfa_object.XmlObject(this.namespaceId, name, attributes);
  }

}

exports.UnknownNamespace = UnknownNamespace;

/***/ }),
/* 87 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.XRef = void 0;

var _util = __w_pdfjs_require__(2);

var _primitives = __w_pdfjs_require__(5);

var _parser = __w_pdfjs_require__(17);

var _core_utils = __w_pdfjs_require__(9);

var _crypto = __w_pdfjs_require__(65);

class XRef {
  constructor(stream, pdfManager) {
    this.stream = stream;
    this.pdfManager = pdfManager;
    this.entries = [];
    this.xrefstms = Object.create(null);
    this._cacheMap = new Map();
    this.stats = {
      streamTypes: Object.create(null),
      fontTypes: Object.create(null)
    };
    this._newRefNum = null;
  }

  getNewRef() {
    if (this._newRefNum === null) {
      this._newRefNum = this.entries.length;
    }

    return _primitives.Ref.get(this._newRefNum++, 0);
  }

  resetNewRef() {
    this._newRefNum = null;
  }

  setStartXRef(startXRef) {
    this.startXRefQueue = [startXRef];
  }

  parse(recoveryMode = false) {
    let trailerDict;

    if (!recoveryMode) {
      trailerDict = this.readXRef();
    } else {
      (0, _util.warn)("Indexing all PDF objects");
      trailerDict = this.indexObjects();
    }

    trailerDict.assignXref(this);
    this.trailer = trailerDict;
    let encrypt;

    try {
      encrypt = trailerDict.get("Encrypt");
    } catch (ex) {
      if (ex instanceof _core_utils.MissingDataException) {
        throw ex;
      }

      (0, _util.warn)(`XRef.parse - Invalid "Encrypt" reference: "${ex}".`);
    }

    if ((0, _primitives.isDict)(encrypt)) {
      const ids = trailerDict.get("ID");
      const fileId = ids && ids.length ? ids[0] : "";
      encrypt.suppressEncryption = true;
      this.encrypt = new _crypto.CipherTransformFactory(encrypt, fileId, this.pdfManager.password);
    }

    let root;

    try {
      root = trailerDict.get("Root");
    } catch (ex) {
      if (ex instanceof _core_utils.MissingDataException) {
        throw ex;
      }

      (0, _util.warn)(`XRef.parse - Invalid "Root" reference: "${ex}".`);
    }

    if ((0, _primitives.isDict)(root) && root.has("Pages")) {
      this.root = root;
    } else {
      if (!recoveryMode) {
        throw new _core_utils.XRefParseException();
      }

      throw new _util.FormatError("Invalid root reference");
    }
  }

  processXRefTable(parser) {
    if (!("tableState" in this)) {
      this.tableState = {
        entryNum: 0,
        streamPos: parser.lexer.stream.pos,
        parserBuf1: parser.buf1,
        parserBuf2: parser.buf2
      };
    }

    const obj = this.readXRefTable(parser);

    if (!(0, _primitives.isCmd)(obj, "trailer")) {
      throw new _util.FormatError("Invalid XRef table: could not find trailer dictionary");
    }

    let dict = parser.getObj();

    if (!(0, _primitives.isDict)(dict) && dict.dict) {
      dict = dict.dict;
    }

    if (!(0, _primitives.isDict)(dict)) {
      throw new _util.FormatError("Invalid XRef table: could not parse trailer dictionary");
    }

    delete this.tableState;
    return dict;
  }

  readXRefTable(parser) {
    const stream = parser.lexer.stream;
    const tableState = this.tableState;
    stream.pos = tableState.streamPos;
    parser.buf1 = tableState.parserBuf1;
    parser.buf2 = tableState.parserBuf2;
    let obj;

    while (true) {
      if (!("firstEntryNum" in tableState) || !("entryCount" in tableState)) {
        if ((0, _primitives.isCmd)(obj = parser.getObj(), "trailer")) {
          break;
        }

        tableState.firstEntryNum = obj;
        tableState.entryCount = parser.getObj();
      }

      let first = tableState.firstEntryNum;
      const count = tableState.entryCount;

      if (!Number.isInteger(first) || !Number.isInteger(count)) {
        throw new _util.FormatError("Invalid XRef table: wrong types in subsection header");
      }

      for (let i = tableState.entryNum; i < count; i++) {
        tableState.streamPos = stream.pos;
        tableState.entryNum = i;
        tableState.parserBuf1 = parser.buf1;
        tableState.parserBuf2 = parser.buf2;
        const entry = {};
        entry.offset = parser.getObj();
        entry.gen = parser.getObj();
        const type = parser.getObj();

        if (type instanceof _primitives.Cmd) {
          switch (type.cmd) {
            case "f":
              entry.free = true;
              break;

            case "n":
              entry.uncompressed = true;
              break;
          }
        }

        if (!Number.isInteger(entry.offset) || !Number.isInteger(entry.gen) || !(entry.free || entry.uncompressed)) {
          throw new _util.FormatError(`Invalid entry in XRef subsection: ${first}, ${count}`);
        }

        if (i === 0 && entry.free && first === 1) {
          first = 0;
        }

        if (!this.entries[i + first]) {
          this.entries[i + first] = entry;
        }
      }

      tableState.entryNum = 0;
      tableState.streamPos = stream.pos;
      tableState.parserBuf1 = parser.buf1;
      tableState.parserBuf2 = parser.buf2;
      delete tableState.firstEntryNum;
      delete tableState.entryCount;
    }

    if (this.entries[0] && !this.entries[0].free) {
      throw new _util.FormatError("Invalid XRef table: unexpected first object");
    }

    return obj;
  }

  processXRefStream(stream) {
    if (!("streamState" in this)) {
      const streamParameters = stream.dict;
      const byteWidths = streamParameters.get("W");
      let range = streamParameters.get("Index");

      if (!range) {
        range = [0, streamParameters.get("Size")];
      }

      this.streamState = {
        entryRanges: range,
        byteWidths,
        entryNum: 0,
        streamPos: stream.pos
      };
    }

    this.readXRefStream(stream);
    delete this.streamState;
    return stream.dict;
  }

  readXRefStream(stream) {
    let i, j;
    const streamState = this.streamState;
    stream.pos = streamState.streamPos;
    const byteWidths = streamState.byteWidths;
    const typeFieldWidth = byteWidths[0];
    const offsetFieldWidth = byteWidths[1];
    const generationFieldWidth = byteWidths[2];
    const entryRanges = streamState.entryRanges;

    while (entryRanges.length > 0) {
      const first = entryRanges[0];
      const n = entryRanges[1];

      if (!Number.isInteger(first) || !Number.isInteger(n)) {
        throw new _util.FormatError(`Invalid XRef range fields: ${first}, ${n}`);
      }

      if (!Number.isInteger(typeFieldWidth) || !Number.isInteger(offsetFieldWidth) || !Number.isInteger(generationFieldWidth)) {
        throw new _util.FormatError(`Invalid XRef entry fields length: ${first}, ${n}`);
      }

      for (i = streamState.entryNum; i < n; ++i) {
        streamState.entryNum = i;
        streamState.streamPos = stream.pos;
        let type = 0,
            offset = 0,
            generation = 0;

        for (j = 0; j < typeFieldWidth; ++j) {
          type = type << 8 | stream.getByte();
        }

        if (typeFieldWidth === 0) {
          type = 1;
        }

        for (j = 0; j < offsetFieldWidth; ++j) {
          offset = offset << 8 | stream.getByte();
        }

        for (j = 0; j < generationFieldWidth; ++j) {
          generation = generation << 8 | stream.getByte();
        }

        const entry = {};
        entry.offset = offset;
        entry.gen = generation;

        switch (type) {
          case 0:
            entry.free = true;
            break;

          case 1:
            entry.uncompressed = true;
            break;

          case 2:
            break;

          default:
            throw new _util.FormatError(`Invalid XRef entry type: ${type}`);
        }

        if (!this.entries[first + i]) {
          this.entries[first + i] = entry;
        }
      }

      streamState.entryNum = 0;
      streamState.streamPos = stream.pos;
      entryRanges.splice(0, 2);
    }
  }

  indexObjects() {
    const TAB = 0x9,
          LF = 0xa,
          CR = 0xd,
          SPACE = 0x20;
    const PERCENT = 0x25,
          LT = 0x3c;

    function readToken(data, offset) {
      let token = "",
          ch = data[offset];

      while (ch !== LF && ch !== CR && ch !== LT) {
        if (++offset >= data.length) {
          break;
        }

        token += String.fromCharCode(ch);
        ch = data[offset];
      }

      return token;
    }

    function skipUntil(data, offset, what) {
      const length = what.length,
            dataLength = data.length;
      let skipped = 0;

      while (offset < dataLength) {
        let i = 0;

        while (i < length && data[offset + i] === what[i]) {
          ++i;
        }

        if (i >= length) {
          break;
        }

        offset++;
        skipped++;
      }

      return skipped;
    }

    const objRegExp = /^(\d+)\s+(\d+)\s+obj\b/;
    const endobjRegExp = /\bendobj[\b\s]$/;
    const nestedObjRegExp = /\s+(\d+\s+\d+\s+obj[\b\s<])$/;
    const CHECK_CONTENT_LENGTH = 25;
    const trailerBytes = new Uint8Array([116, 114, 97, 105, 108, 101, 114]);
    const startxrefBytes = new Uint8Array([115, 116, 97, 114, 116, 120, 114, 101, 102]);
    const objBytes = new Uint8Array([111, 98, 106]);
    const xrefBytes = new Uint8Array([47, 88, 82, 101, 102]);
    this.entries.length = 0;
    const stream = this.stream;
    stream.pos = 0;
    const buffer = stream.getBytes(),
          length = buffer.length;
    let position = stream.start;
    const trailers = [],
          xrefStms = [];

    while (position < length) {
      let ch = buffer[position];

      if (ch === TAB || ch === LF || ch === CR || ch === SPACE) {
        ++position;
        continue;
      }

      if (ch === PERCENT) {
        do {
          ++position;

          if (position >= length) {
            break;
          }

          ch = buffer[position];
        } while (ch !== LF && ch !== CR);

        continue;
      }

      const token = readToken(buffer, position);
      let m;

      if (token.startsWith("xref") && (token.length === 4 || /\s/.test(token[4]))) {
        position += skipUntil(buffer, position, trailerBytes);
        trailers.push(position);
        position += skipUntil(buffer, position, startxrefBytes);
      } else if (m = objRegExp.exec(token)) {
        const num = m[1] | 0,
              gen = m[2] | 0;

        if (!this.entries[num] || this.entries[num].gen === gen) {
          this.entries[num] = {
            offset: position - stream.start,
            gen,
            uncompressed: true
          };
        }

        let contentLength,
            startPos = position + token.length;

        while (startPos < buffer.length) {
          const endPos = startPos + skipUntil(buffer, startPos, objBytes) + 4;
          contentLength = endPos - position;
          const checkPos = Math.max(endPos - CHECK_CONTENT_LENGTH, startPos);
          const tokenStr = (0, _util.bytesToString)(buffer.subarray(checkPos, endPos));

          if (endobjRegExp.test(tokenStr)) {
            break;
          } else {
            const objToken = nestedObjRegExp.exec(tokenStr);

            if (objToken && objToken[1]) {
              (0, _util.warn)('indexObjects: Found new "obj" inside of another "obj", ' + 'caused by missing "endobj" -- trying to recover.');
              contentLength -= objToken[1].length;
              break;
            }
          }

          startPos = endPos;
        }

        const content = buffer.subarray(position, position + contentLength);
        const xrefTagOffset = skipUntil(content, 0, xrefBytes);

        if (xrefTagOffset < contentLength && content[xrefTagOffset + 5] < 64) {
          xrefStms.push(position - stream.start);
          this.xrefstms[position - stream.start] = 1;
        }

        position += contentLength;
      } else if (token.startsWith("trailer") && (token.length === 7 || /\s/.test(token[7]))) {
        trailers.push(position);
        position += skipUntil(buffer, position, startxrefBytes);
      } else {
        position += token.length + 1;
      }
    }

    for (let i = 0, ii = xrefStms.length; i < ii; ++i) {
      this.startXRefQueue.push(xrefStms[i]);
      this.readXRef(true);
    }

    let trailerDict;

    for (let i = 0, ii = trailers.length; i < ii; ++i) {
      stream.pos = trailers[i];
      const parser = new _parser.Parser({
        lexer: new _parser.Lexer(stream),
        xref: this,
        allowStreams: true,
        recoveryMode: true
      });
      const obj = parser.getObj();

      if (!(0, _primitives.isCmd)(obj, "trailer")) {
        continue;
      }

      const dict = parser.getObj();

      if (!(0, _primitives.isDict)(dict)) {
        continue;
      }

      try {
        const rootDict = dict.get("Root");

        if (!(rootDict instanceof _primitives.Dict)) {
          continue;
        }

        const pagesDict = rootDict.get("Pages");

        if (!(pagesDict instanceof _primitives.Dict)) {
          continue;
        }

        const pagesCount = pagesDict.get("Count");

        if (!Number.isInteger(pagesCount)) {
          continue;
        }
      } catch (ex) {
        continue;
      }

      if (dict.has("ID")) {
        return dict;
      }

      trailerDict = dict;
    }

    if (trailerDict) {
      return trailerDict;
    }

    throw new _util.InvalidPDFException("Invalid PDF structure.");
  }

  readXRef(recoveryMode = false) {
    const stream = this.stream;
    const startXRefParsedCache = new Set();

    try {
      while (this.startXRefQueue.length) {
        const startXRef = this.startXRefQueue[0];

        if (startXRefParsedCache.has(startXRef)) {
          (0, _util.warn)("readXRef - skipping XRef table since it was already parsed.");
          this.startXRefQueue.shift();
          continue;
        }

        startXRefParsedCache.add(startXRef);
        stream.pos = startXRef + stream.start;
        const parser = new _parser.Parser({
          lexer: new _parser.Lexer(stream),
          xref: this,
          allowStreams: true
        });
        let obj = parser.getObj();
        let dict;

        if ((0, _primitives.isCmd)(obj, "xref")) {
          dict = this.processXRefTable(parser);

          if (!this.topDict) {
            this.topDict = dict;
          }

          obj = dict.get("XRefStm");

          if (Number.isInteger(obj)) {
            const pos = obj;

            if (!(pos in this.xrefstms)) {
              this.xrefstms[pos] = 1;
              this.startXRefQueue.push(pos);
            }
          }
        } else if (Number.isInteger(obj)) {
          if (!Number.isInteger(parser.getObj()) || !(0, _primitives.isCmd)(parser.getObj(), "obj") || !(0, _primitives.isStream)(obj = parser.getObj())) {
            throw new _util.FormatError("Invalid XRef stream");
          }

          dict = this.processXRefStream(obj);

          if (!this.topDict) {
            this.topDict = dict;
          }

          if (!dict) {
            throw new _util.FormatError("Failed to read XRef stream");
          }
        } else {
          throw new _util.FormatError("Invalid XRef stream header");
        }

        obj = dict.get("Prev");

        if (Number.isInteger(obj)) {
          this.startXRefQueue.push(obj);
        } else if ((0, _primitives.isRef)(obj)) {
          this.startXRefQueue.push(obj.num);
        }

        this.startXRefQueue.shift();
      }

      return this.topDict;
    } catch (e) {
      if (e instanceof _core_utils.MissingDataException) {
        throw e;
      }

      (0, _util.info)("(while reading XRef): " + e);
    }

    if (recoveryMode) {
      return undefined;
    }

    throw new _core_utils.XRefParseException();
  }

  getEntry(i) {
    const xrefEntry = this.entries[i];

    if (xrefEntry && !xrefEntry.free && xrefEntry.offset) {
      return xrefEntry;
    }

    return null;
  }

  fetchIfRef(obj, suppressEncryption = false) {
    if (obj instanceof _primitives.Ref) {
      return this.fetch(obj, suppressEncryption);
    }

    return obj;
  }

  fetch(ref, suppressEncryption = false) {
    if (!(ref instanceof _primitives.Ref)) {
      throw new Error("ref object is not a reference");
    }

    const num = ref.num;

    const cacheEntry = this._cacheMap.get(num);

    if (cacheEntry !== undefined) {
      if (cacheEntry instanceof _primitives.Dict && !cacheEntry.objId) {
        cacheEntry.objId = ref.toString();
      }

      return cacheEntry;
    }

    let xrefEntry = this.getEntry(num);

    if (xrefEntry === null) {
      this._cacheMap.set(num, xrefEntry);

      return xrefEntry;
    }

    if (xrefEntry.uncompressed) {
      xrefEntry = this.fetchUncompressed(ref, xrefEntry, suppressEncryption);
    } else {
      xrefEntry = this.fetchCompressed(ref, xrefEntry, suppressEncryption);
    }

    if ((0, _primitives.isDict)(xrefEntry)) {
      xrefEntry.objId = ref.toString();
    } else if ((0, _primitives.isStream)(xrefEntry)) {
      xrefEntry.dict.objId = ref.toString();
    }

    return xrefEntry;
  }

  fetchUncompressed(ref, xrefEntry, suppressEncryption = false) {
    const gen = ref.gen;
    let num = ref.num;

    if (xrefEntry.gen !== gen) {
      throw new _core_utils.XRefEntryException(`Inconsistent generation in XRef: ${ref}`);
    }

    const stream = this.stream.makeSubStream(xrefEntry.offset + this.stream.start);
    const parser = new _parser.Parser({
      lexer: new _parser.Lexer(stream),
      xref: this,
      allowStreams: true
    });
    const obj1 = parser.getObj();
    const obj2 = parser.getObj();
    const obj3 = parser.getObj();

    if (obj1 !== num || obj2 !== gen || !(obj3 instanceof _primitives.Cmd)) {
      throw new _core_utils.XRefEntryException(`Bad (uncompressed) XRef entry: ${ref}`);
    }

    if (obj3.cmd !== "obj") {
      if (obj3.cmd.startsWith("obj")) {
        num = parseInt(obj3.cmd.substring(3), 10);

        if (!Number.isNaN(num)) {
          return num;
        }
      }

      throw new _core_utils.XRefEntryException(`Bad (uncompressed) XRef entry: ${ref}`);
    }

    if (this.encrypt && !suppressEncryption) {
      xrefEntry = parser.getObj(this.encrypt.createCipherTransform(num, gen));
    } else {
      xrefEntry = parser.getObj();
    }

    if (!(0, _primitives.isStream)(xrefEntry)) {
      this._cacheMap.set(num, xrefEntry);
    }

    return xrefEntry;
  }

  fetchCompressed(ref, xrefEntry, suppressEncryption = false) {
    const tableOffset = xrefEntry.offset;
    const stream = this.fetch(_primitives.Ref.get(tableOffset, 0));

    if (!(0, _primitives.isStream)(stream)) {
      throw new _util.FormatError("bad ObjStm stream");
    }

    const first = stream.dict.get("First");
    const n = stream.dict.get("N");

    if (!Number.isInteger(first) || !Number.isInteger(n)) {
      throw new _util.FormatError("invalid first and n parameters for ObjStm stream");
    }

    let parser = new _parser.Parser({
      lexer: new _parser.Lexer(stream),
      xref: this,
      allowStreams: true
    });
    const nums = new Array(n);
    const offsets = new Array(n);

    for (let i = 0; i < n; ++i) {
      const num = parser.getObj();

      if (!Number.isInteger(num)) {
        throw new _util.FormatError(`invalid object number in the ObjStm stream: ${num}`);
      }

      const offset = parser.getObj();

      if (!Number.isInteger(offset)) {
        throw new _util.FormatError(`invalid object offset in the ObjStm stream: ${offset}`);
      }

      nums[i] = num;
      offsets[i] = offset;
    }

    const start = (stream.start || 0) + first;
    const entries = new Array(n);

    for (let i = 0; i < n; ++i) {
      const length = i < n - 1 ? offsets[i + 1] - offsets[i] : undefined;

      if (length < 0) {
        throw new _util.FormatError("Invalid offset in the ObjStm stream.");
      }

      parser = new _parser.Parser({
        lexer: new _parser.Lexer(stream.makeSubStream(start + offsets[i], length, stream.dict)),
        xref: this,
        allowStreams: true
      });
      const obj = parser.getObj();
      entries[i] = obj;

      if ((0, _primitives.isStream)(obj)) {
        continue;
      }

      const num = nums[i],
            entry = this.entries[num];

      if (entry && entry.offset === tableOffset && entry.gen === i) {
        this._cacheMap.set(num, obj);
      }
    }

    xrefEntry = entries[xrefEntry.gen];

    if (xrefEntry === undefined) {
      throw new _core_utils.XRefEntryException(`Bad (compressed) XRef entry: ${ref}`);
    }

    return xrefEntry;
  }

  async fetchIfRefAsync(obj, suppressEncryption) {
    if (obj instanceof _primitives.Ref) {
      return this.fetchAsync(obj, suppressEncryption);
    }

    return obj;
  }

  async fetchAsync(ref, suppressEncryption) {
    try {
      return this.fetch(ref, suppressEncryption);
    } catch (ex) {
      if (!(ex instanceof _core_utils.MissingDataException)) {
        throw ex;
      }

      await this.pdfManager.requestRange(ex.begin, ex.end);
      return this.fetchAsync(ref, suppressEncryption);
    }
  }

  getCatalogObj() {
    return this.root;
  }

}

exports.XRef = XRef;

/***/ }),
/* 88 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.MessageHandler = void 0;

var _util = __w_pdfjs_require__(2);

const CallbackKind = {
  UNKNOWN: 0,
  DATA: 1,
  ERROR: 2
};
const StreamKind = {
  UNKNOWN: 0,
  CANCEL: 1,
  CANCEL_COMPLETE: 2,
  CLOSE: 3,
  ENQUEUE: 4,
  ERROR: 5,
  PULL: 6,
  PULL_COMPLETE: 7,
  START_COMPLETE: 8
};

function wrapReason(reason) {
  if (typeof reason !== "object" || reason === null) {
    return reason;
  }

  switch (reason.name) {
    case "AbortException":
      return new _util.AbortException(reason.message);

    case "MissingPDFException":
      return new _util.MissingPDFException(reason.message);

    case "UnexpectedResponseException":
      return new _util.UnexpectedResponseException(reason.message, reason.status);

    case "UnknownErrorException":
      return new _util.UnknownErrorException(reason.message, reason.details);

    default:
      return new _util.UnknownErrorException(reason.message, reason.toString());
  }
}

class MessageHandler {
  constructor(sourceName, targetName, comObj) {
    this.sourceName = sourceName;
    this.targetName = targetName;
    this.comObj = comObj;
    this.callbackId = 1;
    this.streamId = 1;
    this.postMessageTransfers = true;
    this.streamSinks = Object.create(null);
    this.streamControllers = Object.create(null);
    this.callbackCapabilities = Object.create(null);
    this.actionHandler = Object.create(null);

    this._onComObjOnMessage = event => {
      const data = event.data;

      if (data.targetName !== this.sourceName) {
        return;
      }

      if (data.stream) {
        this._processStreamMessage(data);

        return;
      }

      if (data.callback) {
        const callbackId = data.callbackId;
        const capability = this.callbackCapabilities[callbackId];

        if (!capability) {
          throw new Error(`Cannot resolve callback ${callbackId}`);
        }

        delete this.callbackCapabilities[callbackId];

        if (data.callback === CallbackKind.DATA) {
          capability.resolve(data.data);
        } else if (data.callback === CallbackKind.ERROR) {
          capability.reject(wrapReason(data.reason));
        } else {
          throw new Error("Unexpected callback case");
        }

        return;
      }

      const action = this.actionHandler[data.action];

      if (!action) {
        throw new Error(`Unknown action from worker: ${data.action}`);
      }

      if (data.callbackId) {
        const cbSourceName = this.sourceName;
        const cbTargetName = data.sourceName;
        new Promise(function (resolve) {
          resolve(action(data.data));
        }).then(function (result) {
          comObj.postMessage({
            sourceName: cbSourceName,
            targetName: cbTargetName,
            callback: CallbackKind.DATA,
            callbackId: data.callbackId,
            data: result
          });
        }, function (reason) {
          comObj.postMessage({
            sourceName: cbSourceName,
            targetName: cbTargetName,
            callback: CallbackKind.ERROR,
            callbackId: data.callbackId,
            reason: wrapReason(reason)
          });
        });
        return;
      }

      if (data.streamId) {
        this._createStreamSink(data);

        return;
      }

      action(data.data);
    };

    comObj.addEventListener("message", this._onComObjOnMessage);
  }

  on(actionName, handler) {
    const ah = this.actionHandler;

    if (ah[actionName]) {
      throw new Error(`There is already an actionName called "${actionName}"`);
    }

    ah[actionName] = handler;
  }

  send(actionName, data, transfers) {
    this._postMessage({
      sourceName: this.sourceName,
      targetName: this.targetName,
      action: actionName,
      data
    }, transfers);
  }

  sendWithPromise(actionName, data, transfers) {
    const callbackId = this.callbackId++;
    const capability = (0, _util.createPromiseCapability)();
    this.callbackCapabilities[callbackId] = capability;

    try {
      this._postMessage({
        sourceName: this.sourceName,
        targetName: this.targetName,
        action: actionName,
        callbackId,
        data
      }, transfers);
    } catch (ex) {
      capability.reject(ex);
    }

    return capability.promise;
  }

  sendWithStream(actionName, data, queueingStrategy, transfers) {
    const streamId = this.streamId++;
    const sourceName = this.sourceName;
    const targetName = this.targetName;
    const comObj = this.comObj;
    return new ReadableStream({
      start: controller => {
        const startCapability = (0, _util.createPromiseCapability)();
        this.streamControllers[streamId] = {
          controller,
          startCall: startCapability,
          pullCall: null,
          cancelCall: null,
          isClosed: false
        };

        this._postMessage({
          sourceName,
          targetName,
          action: actionName,
          streamId,
          data,
          desiredSize: controller.desiredSize
        }, transfers);

        return startCapability.promise;
      },
      pull: controller => {
        const pullCapability = (0, _util.createPromiseCapability)();
        this.streamControllers[streamId].pullCall = pullCapability;
        comObj.postMessage({
          sourceName,
          targetName,
          stream: StreamKind.PULL,
          streamId,
          desiredSize: controller.desiredSize
        });
        return pullCapability.promise;
      },
      cancel: reason => {
        (0, _util.assert)(reason instanceof Error, "cancel must have a valid reason");
        const cancelCapability = (0, _util.createPromiseCapability)();
        this.streamControllers[streamId].cancelCall = cancelCapability;
        this.streamControllers[streamId].isClosed = true;
        comObj.postMessage({
          sourceName,
          targetName,
          stream: StreamKind.CANCEL,
          streamId,
          reason: wrapReason(reason)
        });
        return cancelCapability.promise;
      }
    }, queueingStrategy);
  }

  _createStreamSink(data) {
    const self = this;
    const action = this.actionHandler[data.action];
    const streamId = data.streamId;
    const sourceName = this.sourceName;
    const targetName = data.sourceName;
    const comObj = this.comObj;
    const streamSink = {
      enqueue(chunk, size = 1, transfers) {
        if (this.isCancelled) {
          return;
        }

        const lastDesiredSize = this.desiredSize;
        this.desiredSize -= size;

        if (lastDesiredSize > 0 && this.desiredSize <= 0) {
          this.sinkCapability = (0, _util.createPromiseCapability)();
          this.ready = this.sinkCapability.promise;
        }

        self._postMessage({
          sourceName,
          targetName,
          stream: StreamKind.ENQUEUE,
          streamId,
          chunk
        }, transfers);
      },

      close() {
        if (this.isCancelled) {
          return;
        }

        this.isCancelled = true;
        comObj.postMessage({
          sourceName,
          targetName,
          stream: StreamKind.CLOSE,
          streamId
        });
        delete self.streamSinks[streamId];
      },

      error(reason) {
        (0, _util.assert)(reason instanceof Error, "error must have a valid reason");

        if (this.isCancelled) {
          return;
        }

        this.isCancelled = true;
        comObj.postMessage({
          sourceName,
          targetName,
          stream: StreamKind.ERROR,
          streamId,
          reason: wrapReason(reason)
        });
      },

      sinkCapability: (0, _util.createPromiseCapability)(),
      onPull: null,
      onCancel: null,
      isCancelled: false,
      desiredSize: data.desiredSize,
      ready: null
    };
    streamSink.sinkCapability.resolve();
    streamSink.ready = streamSink.sinkCapability.promise;
    this.streamSinks[streamId] = streamSink;
    new Promise(function (resolve) {
      resolve(action(data.data, streamSink));
    }).then(function () {
      comObj.postMessage({
        sourceName,
        targetName,
        stream: StreamKind.START_COMPLETE,
        streamId,
        success: true
      });
    }, function (reason) {
      comObj.postMessage({
        sourceName,
        targetName,
        stream: StreamKind.START_COMPLETE,
        streamId,
        reason: wrapReason(reason)
      });
    });
  }

  _processStreamMessage(data) {
    const streamId = data.streamId;
    const sourceName = this.sourceName;
    const targetName = data.sourceName;
    const comObj = this.comObj;

    switch (data.stream) {
      case StreamKind.START_COMPLETE:
        if (data.success) {
          this.streamControllers[streamId].startCall.resolve();
        } else {
          this.streamControllers[streamId].startCall.reject(wrapReason(data.reason));
        }

        break;

      case StreamKind.PULL_COMPLETE:
        if (data.success) {
          this.streamControllers[streamId].pullCall.resolve();
        } else {
          this.streamControllers[streamId].pullCall.reject(wrapReason(data.reason));
        }

        break;

      case StreamKind.PULL:
        if (!this.streamSinks[streamId]) {
          comObj.postMessage({
            sourceName,
            targetName,
            stream: StreamKind.PULL_COMPLETE,
            streamId,
            success: true
          });
          break;
        }

        if (this.streamSinks[streamId].desiredSize <= 0 && data.desiredSize > 0) {
          this.streamSinks[streamId].sinkCapability.resolve();
        }

        this.streamSinks[streamId].desiredSize = data.desiredSize;
        const {
          onPull
        } = this.streamSinks[data.streamId];
        new Promise(function (resolve) {
          resolve(onPull && onPull());
        }).then(function () {
          comObj.postMessage({
            sourceName,
            targetName,
            stream: StreamKind.PULL_COMPLETE,
            streamId,
            success: true
          });
        }, function (reason) {
          comObj.postMessage({
            sourceName,
            targetName,
            stream: StreamKind.PULL_COMPLETE,
            streamId,
            reason: wrapReason(reason)
          });
        });
        break;

      case StreamKind.ENQUEUE:
        (0, _util.assert)(this.streamControllers[streamId], "enqueue should have stream controller");

        if (this.streamControllers[streamId].isClosed) {
          break;
        }

        this.streamControllers[streamId].controller.enqueue(data.chunk);
        break;

      case StreamKind.CLOSE:
        (0, _util.assert)(this.streamControllers[streamId], "close should have stream controller");

        if (this.streamControllers[streamId].isClosed) {
          break;
        }

        this.streamControllers[streamId].isClosed = true;
        this.streamControllers[streamId].controller.close();

        this._deleteStreamController(streamId);

        break;

      case StreamKind.ERROR:
        (0, _util.assert)(this.streamControllers[streamId], "error should have stream controller");
        this.streamControllers[streamId].controller.error(wrapReason(data.reason));

        this._deleteStreamController(streamId);

        break;

      case StreamKind.CANCEL_COMPLETE:
        if (data.success) {
          this.streamControllers[streamId].cancelCall.resolve();
        } else {
          this.streamControllers[streamId].cancelCall.reject(wrapReason(data.reason));
        }

        this._deleteStreamController(streamId);

        break;

      case StreamKind.CANCEL:
        if (!this.streamSinks[streamId]) {
          break;
        }

        const {
          onCancel
        } = this.streamSinks[data.streamId];
        new Promise(function (resolve) {
          resolve(onCancel && onCancel(wrapReason(data.reason)));
        }).then(function () {
          comObj.postMessage({
            sourceName,
            targetName,
            stream: StreamKind.CANCEL_COMPLETE,
            streamId,
            success: true
          });
        }, function (reason) {
          comObj.postMessage({
            sourceName,
            targetName,
            stream: StreamKind.CANCEL_COMPLETE,
            streamId,
            reason: wrapReason(reason)
          });
        });
        this.streamSinks[streamId].sinkCapability.reject(wrapReason(data.reason));
        this.streamSinks[streamId].isCancelled = true;
        delete this.streamSinks[streamId];
        break;

      default:
        throw new Error("Unexpected stream case");
    }
  }

  async _deleteStreamController(streamId) {
    await Promise.allSettled([this.streamControllers[streamId].startCall, this.streamControllers[streamId].pullCall, this.streamControllers[streamId].cancelCall].map(function (capability) {
      return capability && capability.promise;
    }));
    delete this.streamControllers[streamId];
  }

  _postMessage(message, transfers) {
    if (transfers && this.postMessageTransfers) {
      this.comObj.postMessage(message, transfers);
    } else {
      this.comObj.postMessage(message);
    }
  }

  destroy() {
    this.comObj.removeEventListener("message", this._onComObjOnMessage);
  }

}

exports.MessageHandler = MessageHandler;

/***/ }),
/* 89 */
/***/ ((__unused_webpack_module, exports, __w_pdfjs_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PDFWorkerStream = void 0;

var _util = __w_pdfjs_require__(2);

class PDFWorkerStream {
  constructor(msgHandler) {
    this._msgHandler = msgHandler;
    this._contentLength = null;
    this._fullRequestReader = null;
    this._rangeRequestReaders = [];
  }

  getFullReader() {
    (0, _util.assert)(!this._fullRequestReader, "PDFWorkerStream.getFullReader can only be called once.");
    this._fullRequestReader = new PDFWorkerStreamReader(this._msgHandler);
    return this._fullRequestReader;
  }

  getRangeReader(begin, end) {
    const reader = new PDFWorkerStreamRangeReader(begin, end, this._msgHandler);

    this._rangeRequestReaders.push(reader);

    return reader;
  }

  cancelAllRequests(reason) {
    if (this._fullRequestReader) {
      this._fullRequestReader.cancel(reason);
    }

    for (const reader of this._rangeRequestReaders.slice(0)) {
      reader.cancel(reason);
    }
  }

}

exports.PDFWorkerStream = PDFWorkerStream;

class PDFWorkerStreamReader {
  constructor(msgHandler) {
    this._msgHandler = msgHandler;
    this.onProgress = null;
    this._contentLength = null;
    this._isRangeSupported = false;
    this._isStreamingSupported = false;

    const readableStream = this._msgHandler.sendWithStream("GetReader");

    this._reader = readableStream.getReader();
    this._headersReady = this._msgHandler.sendWithPromise("ReaderHeadersReady").then(data => {
      this._isStreamingSupported = data.isStreamingSupported;
      this._isRangeSupported = data.isRangeSupported;
      this._contentLength = data.contentLength;
    });
  }

  get headersReady() {
    return this._headersReady;
  }

  get contentLength() {
    return this._contentLength;
  }

  get isStreamingSupported() {
    return this._isStreamingSupported;
  }

  get isRangeSupported() {
    return this._isRangeSupported;
  }

  async read() {
    const {
      value,
      done
    } = await this._reader.read();

    if (done) {
      return {
        value: undefined,
        done: true
      };
    }

    return {
      value: value.buffer,
      done: false
    };
  }

  cancel(reason) {
    this._reader.cancel(reason);
  }

}

class PDFWorkerStreamRangeReader {
  constructor(begin, end, msgHandler) {
    this._msgHandler = msgHandler;
    this.onProgress = null;

    const readableStream = this._msgHandler.sendWithStream("GetRangeReader", {
      begin,
      end
    });

    this._reader = readableStream.getReader();
  }

  get isStreamingSupported() {
    return false;
  }

  async read() {
    const {
      value,
      done
    } = await this._reader.read();

    if (done) {
      return {
        value: undefined,
        done: true
      };
    }

    return {
      value: value.buffer,
      done: false
    };
  }

  cancel(reason) {
    this._reader.cancel(reason);
  }

}

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __w_pdfjs_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __w_pdfjs_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "WorkerMessageHandler", ({
  enumerable: true,
  get: function () {
    return _worker.WorkerMessageHandler;
  }
}));

var _worker = __w_pdfjs_require__(1);

const pdfjsVersion = '2.9.273';
const pdfjsBuild = 'e394da586';
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});PK
       !<%à¯Æd	  d	  -   chrome/pdfjs/content/web/cmaps/78-EUC-H.bcmap‡RCopyright 1990-2009 Adobe Systems Incorporated.
All rights reserved.
See ./LICENSE  Å é†?•AÅ∫]  Åg` ^Ågaé†?ÇF•A]ÑyÅ"ÖWÇ	ÜÜÜ0Å&RÜJÅ-UáÅ*ásàÅH à# àDq∞° àe ªQàg ¿Jàn æ π"àx ªR1â  ªSâ3 ªTâ8 ªUâAq±°âC ªV	âM ªWâX ªXâ\ ªZâ` ª['âe ª\äq≤°ä! ª] πI ª^4ä+ ª_äa ª`ä{ ªa ä~q≥° ä ªbã ≤aã! ßã( ªcãD ªdãJ ªeãR Æ1ãU ªfãYq
¥° ã] ªg ™rå  ªhå
 ¥ å ªiå"aµ°	å;  ªj åF  ªk =å[q∂° ç ªlç ªmç# ∫2ç? ªnçH ªoçf ªpçm ªq çt ªr çvq∑°çw ªsç{ ªté ªué ªvé% ªwé) ªxé, ∏é2 ªyé; ªzéH ª{éP ª|a∏°éU  ª} éi  ª~ <évqπ°	è3 ª
è> º 	èJ ºèU ≠]èo ºê  ºê ºêa∫°1ê  º êD  º êX  º 	êeq	ª°êo ºêv º	 êy º
ê{ ºDëaº°&ëM  º  ≤) ëv  º í º íq	Ω°	í+ º	í6 º4íAºíxº
í~qæ°ì	 ºì º
ì ºì( ºì> ºìH ºìMq	ø°ìg º-ìq ºî  ºî' º î0q¿° îE º!îG º""îg º#	ïº$ïº&ïq¡°ï# º( ¥nï+ º)ï< º*ïO º+ïR º,ïb º-ïlq¬°ñ º.ñ º/ñ. º0ñ= º1
ñD º2ñPº3ñW º5 ñ^q√°ñ_ º6 ñfº7ñiº9ñm º;1ñ| º<ó/ º=ó4 º>ó;qƒ°ó= º?	óZ º@ óe ºAóg ºB ój ºCól ¿Kóq £5"óxq≈° ò ºDò ºEò" ºFò) ºGò1 ºHò: ºIòC ºJòFºKòM ≠_òR ºMò_ ®Pòi ™6òn ºNòsq∆°òy ºOô ºPôºQô.ºSô5 ºUô:ºVô@ ºX
ôC µmôOq«°ôW ºYô` ºZôp º[ö º\ ≥	 º]ö  º^ö$q»°ö5 º_ö9 º` öC ºa"öE ºböi ºcöw ºdõ
q…° õºe
õ ºg ®; õ# ºhõ% ºi	õ( ºjõ3 ºkõA ºl,õDq	 °!õq ºmú ºnú ºoú+ ºpúJqÀ° úO ºqúQ ºr úX ºsúz ∫3ù ºtù æ, †/ù(qÃ°+ù- ºu
ùZ ºvùf ºwùl ºxùo ≤5 ºy û ºz û	 º{qÕ°û º|û º}û; º~û? ∫4ûE ºûTa
Œ°)ûi-üüDÅ#üHüXü]ü`ÅM4üz  ù' '†0aœ∂ ÆwaŒÀ Ω .ΩÅ% Ω Ω Ωq	—°†X Ω†u Ω† Ω ° Ω	0°a“°]°6q	”°¢ Ω
¢$ Ω"¢. Ω¢R Ω¢_aŸ¯ ã'a‘°"¢r£  ów £6Å"£P$£m§Å" §.[§0Å"]•Å"•jY•nÅ">¶H
ß
ßß Å"ß&ß?0ßSa	‘ƒ ΩÅx Ω% ΩÅ> ΩÑ ΩÇ; Ω ΩÅL Ω Ωq€°#® Ω®) Ω®. õ"®< Ω ®O òh®Q Ω	®Xaﬁπ òm; ãa‹°]®bÅ"]©@Å"™™7#™N™sÅ"]™|Å"´Z7´`¨¨0Å"	¨8¨CL¨Iaﬁ– ΩÉU Ω8 Ω  ∫5Å4 Ω!Ω"q	‚°	≠ Ω$;≠! èn ≠^ òQ≠` Ω%≠ea„°(≠t  Ω& Æ  Ω' Æ(  ãT Æ2q	‰°ÆR Ω(Æk ü\Æx Ω)Ø Ω*Ø aÈ¢ ëu7 ã aÈÆ ûaÂ°Ø0  Ω+  ØI  Ω, 	ØK  Ω- 7ØVÅ"$∞  Ω. 7∞4Å"B∞l  Ω/ ±0  Ω0 ±5  Ω1 ±>Å"±J  Ω2 ±^  Ω3 7±e  Ω4 	≤Å" ≤(
≤**≤6#≤bq	Í°≥ ö≥
 Ω6≥ Ω70≥# Ω8≥Uq	Î°≥d Ω9)≥v å¥! Ω:¥* Ω;¥:aÏÕ ï*aÏ°+¥B¥o	µ	µÅ",µ µN µlµnÅ"µ~∂∂&∂5Å"]∂\aÏÈ Ω<
 Ω=ÅY Ω> Ω? Ω@Å: ΩA ΩB ΩCq
°#∑: ΩF
∑_ ΩG∑k ΩH∑q é1 ΩI∏aÒ°]∏q
Ú°∏v ΩJπ ΩKπ àw ΩL$π$ ä)	πJaÛ°/πT  ΩM *∫  ΩN  ∫1PK
       !<8íuH≠   ≠   -   chrome/pdfjs/content/web/cmaps/78-EUC-V.bcmap‡RCopyright 1990-2009 Adobe Systems Incorporated.
All rights reserved.
See ./LICENSE·78-EUC-Ha°¢ΩOΩQ	ΩSΩVΩ[A°·ΩmÖ?          Å2          a•ıæPK
       !<˙U+K	  K	  )   chrome/pdfjs/content/web/cmaps/78-H.bcmap‡RCopyright 1990-2009 Adobe Systems Incorporated.
All rights reserved.
See ./LICENSE!!Å∫]a!!]ÑyÅ"ÖWÇ	ÜÜÜ0Å&RÜJÅ-UáÅ*ásàÅH à# àDq0! àe ªQàg ¿Jàn æ π"àx ªR1â  ªSâ3 ªTâ8 ªUâAq1!âC ªV	âM ªWâX ªXâ\ ªZâ` ª['âe ª\äq2!ä! ª] πI ª^4ä+ ª_äa ª`ä{ ªa ä~q3! ä ªbã ≤aã! ßã( ªcãD ªdãJ ªeãR Æ1ãU ªfãYq
4! ã] ªg ™rå  ªhå
 ¥ å ªiå"a5!	å;  ªj åF  ªk =å[q6! ç ªlç ªmç# ∫2ç? ªnçH ªoçf ªpçm ªq çt ªr çvq7!çw ªsç{ ªté ªué ªvé% ªwé) ªxé, ∏é2 ªyé; ªzéH ª{éP ª|a8!éU  ª} éi  ª~ <évq9!	è3 ª
è> º 	èJ ºèU ≠]èo ºê  ºê ºêa:!1ê  º êD  º êX  º 	êeq	;!êo ºêv º	 êy º
ê{ ºDëa<!&ëM  º  ≤) ëv  º í º íq	=!	í+ º	í6 º4íAºíxº
í~q>!ì	 ºì º
ì ºì( ºì> ºìH ºìMq	?!ìg º-ìq ºî  ºî' º î0q@! îE º!îG º""îg º#	ïº$ïº&ïqA!ï# º( ¥nï+ º)ï< º*ïO º+ïR º,ïb º-ïlqB!ñ º.ñ º/ñ. º0ñ= º1
ñD º2ñPº3ñW º5 ñ^qC!ñ_ º6 ñfº7ñiº9ñm º;1ñ| º<ó/ º=ó4 º>ó;qD!ó= º?	óZ º@ óe ºAóg ºB ój ºCól ¿Kóq £5"óxqE! ò ºDò ºEò" ºFò) ºGò1 ºHò: ºIòC ºJòFºKòM ≠_òR ºMò_ ®Pòi ™6òn ºNòsqF!òy ºOô ºPôºQô.ºSô5 ºUô:ºVô@ ºX
ôC µmôOqG!ôW ºYô` ºZôp º[ö º\ ≥	 º]ö  º^ö$qH!ö5 º_ö9 º` öC ºa"öE ºböi ºcöw ºdõ
qI! õºe
õ ºg ®; õ# ºhõ% ºi	õ( ºjõ3 ºkõA ºl,õDq	J!!õq ºmú ºnú ºoú+ ºpúJqK! úO ºqúQ ºr úX ºsúz ∫3ù ºtù æ, †/ù(qL!+ù- ºu
ùZ ºvùf ºwùl ºxùo ≤5 ºy û ºz û	 º{qM!û º|û º}û; º~û? ∫4ûE ºûTa
N!)ûi-üüDÅ#üHüXü]ü`ÅM4üz  ù' '†0aO6 ÆwaNK Ω .ΩÅ% Ω Ω Ωq	Q!†X Ω†u Ω† Ω ° Ω	0°aR!]°6q	S!¢ Ω
¢$ Ω"¢. Ω¢R Ω¢_aYx ã'aT!"¢r£  ów £6Å"£P$£m§Å" §.[§0Å"]•Å"•jY•nÅ">¶H
ß
ßß Å"ß&ß?0ßSa	TD ΩÅx Ω% ΩÅ> ΩÑ ΩÇ; Ω ΩÅL Ω Ωq[!#® Ω®) Ω®. õ"®< Ω ®O òh®Q Ω	®Xa^9 òm; ãa\!]®bÅ"]©@Å"™™7#™N™sÅ"]™|Å"´Z7´`¨¨0Å"	¨8¨CL¨Ia^P ΩÉU Ω8 Ω  ∫5Å4 Ω!Ω"q	b!	≠ Ω$;≠! èn ≠^ òQ≠` Ω%≠eac!(≠t  Ω& Æ  Ω' Æ(  ãT Æ2q	d!ÆR Ω(Æk ü\Æx Ω)Ø Ω*Ø ai" ëu7 ã ai. ûae!Ø0  Ω+  ØI  Ω, 	ØK  Ω- 7ØVÅ"$∞  Ω. 7∞4Å"B∞l  Ω/ ±0  Ω0 ±5  Ω1 ±>Å"±J  Ω2 ±^  Ω3 7±e  Ω4 	≤Å" ≤(
≤**≤6#≤bq	j!≥ ö≥
 Ω6≥ Ω70≥# Ω8≥Uq	k!≥d Ω9)≥v å¥! Ω:¥* Ω;¥:alM ï*al!+¥B¥o	µ	µÅ",µ µN µlµnÅ"µ~∂∂&∂5Å"]∂\ali Ω<
 Ω=ÅY Ω> Ω? Ω@Å: ΩA ΩB ΩCq
p!#∑: ΩF
∑_ ΩG∑k ΩH∑q é1 ΩI∏aq!]∏q
r!∏v ΩJπ ΩKπ àw ΩL$π$ ä)	πJas!/πT  ΩM *∫  ΩN  ∫1PK
       !<önÊâ^	  ^	  .   chrome/pdfjs/content/web/cmaps/78-RKSJ-H.bcmap‡RCopyright 1990-2009 Adobe Systems Incorporated.
All rights reserved.
See ./LICENSE  Å Å@Ω< †?‡@π<  Åg` ^ÅgaÅ@>Ñy,Ö8Å"	ÜÜÜ0RÜJN>áá\ásài à#àDàSqàü àe ªQàg ¿Jàn æ π"àx ªR1â  ªSâ3 ªTâ8 ªUâAqâ@âC ªV	âM ªWâX ªXâ\ ªZâ` ª[âeqâÄ
ä ª\ä ª] πI ª^4ä+ ª_äa ª`ä{ ªa ä~aä@ ä  ªb ã  ≤a ã!  ß ã(qäÄã> ªcãD ªdãJ ªeãR Æ1ãU ªf$ãY ªg ™rå  ªhå
 ¥ å ªiå"aã@	å;  ªj åF  ªk å[qãÄåz ªlç ªmç# ∫2ç? ªnçH ªoçf ªpçm ªq çt ªr çvqå@çw ªsç{ ªté ªué ªvé% ªwé) ªxé, ∏é2qåÄé6 ªyé; ªzéH ª{éP ª|éU ª}éi ª~<évq	ç@	è3 ª
è> º 	èJ ºèU ≠]èoqçÄèr ºê  ºê º6ê ºêD ºêX º	êeq	é@êo ºêv º	 êy º
ê{ º%ëaéÄEë.ëvííC	í+	í6(íAaé« ≤)aé∆ º ººm º
 ºqèÄíjºíxºí~ ºì º
ì ºì( ºì> ºìH ºìMaê@ìg  º -ìq  º î qêÄ ºî' º î0 º!îG º""îg º#	ïº$ïº&ïqë@ï# º( ¥nï+ º)ï< º*ïO º+ïR º,qëÄïb º-0ïl º.ñ º/ñ. º0ñ= º1
ñD º2ñPº3ñW º5 ñ^q	í@ñ_ º6 ñfº7ñiº9ñm º;!ñ|qíÄó º<ó/ º=ó4 º>ó; º?	óZ º@ óe ºAóg ºB ój ºCól ¿Kóq £5"óxqì@ ò ºDò ºEò" ºFò) ºGò1 ºHò: ºIòC ºJòFºKòM ≠_òRqìÄòZ ºMò_ ®Pòi ™6òn ºN"òs ºOô ºPôºQô.ºSô5 ºUô:ºVô@ ºX
ôC µmôOaî@ôW  ºY ô`  ºZ ôp  º[ öqîÄö º\ ≥	 º]ö  º^ö$ º_ö9 º` öC ºa"öE ºböi ºcöw ºdõ
qï@ õºe
õ ºg ®; õ# ºhõ% ºi	õ( ºjõ3 ºkõA ºlõDq	ïÄ@õR ºmú ºnú ºoú+ ºpúJañ@ úO  ºq úQ  ºr  úX  ºs úzqñÄ	ù ∫3ù ºtù æ, †/0ù( ºu
ùZ ºvùf ºwùl ºxùo ≤5 ºy û ºz û	 º{q	ó@û º|û º}û; º~û? ∫4ûEaóÄûJ>ûT-üüDDüHüXü]ü`,4üz  ù' '†0aòU Æwaóâ º? Ω .ΩF Ω Ω Ωq	ô@†X Ω†u Ω† Ω ° Ω	°aö‚ ówaôÄ|°C¢¢$"¢. ¢R
¢S5¢_££6C£P!£m§§[§0C>•!•KY•nC>¶Ha	öO Ω
	 Ω# Ω Ω6 ΩÅ Ω& Ω ΩÇ Ωq
ùÄ Ω
ß Ω
ß ã'ß  Ωß? Ω0ßSaüÛ ãaû@#®®)®.  õ" ®<
®C ®O  òh ®Qg®XC>©@6©  òm ™7#™N™saûd Ω Ω! Ω ΩÇ9 Ω`†?ÇFa‡@>™|#´;7´`¨¨0C	¨8¨C-¨Ia‡Ù ∫5a‡§ Ω8 Ω l Ω!Ω"q	·Ä(¨w Ω$;≠! èn ≠^ òQ≠` Ω%≠ea‚@(≠t  Ω& Æ  Ω' Æ(  ãT  Æ2q	‚Ä6Æ3 Ω(Æk ü\Æx Ω)Ø Ω*Ø a„@Ø0  Ω+  ØI  Ω, 	ØK  Ω- ØVCØo  Ω. 7∞4C>∞lq‰Ä±+ Ω/±0 Ω0±5 Ω1±> Ω2±^ Ω37±e Ω4	≤aÂ@ ≤(  ëu 
≤*  û *≤6  ã  ≤bq	ÂÄ!≤g ö≥
 Ω6≥ Ω70≥# Ω8≥UaÊ@≥d  Ω9 )≥v  å ¥!qÊÄ¥# Ω:¥* Ω;3¥: ï*¥o Ω<	µ Ω=	µaÁ@,µ   Ω> µNqÁÄµ_ Ω? µl Ω@µn ΩA∂ ΩB∂ ΩC&∂5aË@>∂\q
ËÄB∑ ΩF
∑_ ΩG∑k ΩH∑q é1 ΩI∏aÈ@>∏q
ÈÄ*∏W ΩJπ ΩKπ àw ΩL$π$ ä)	πJaÍ@/πT  ΩM ∫∫  ΩN  ∫1PK
       !<À@i≠   ≠   .   chrome/pdfjs/content/web/cmaps/78-RKSJ-V.bcmap‡RCopyright 1990-2009 Adobe Systems Incorporated.
All rights reserved.
See ./LICENSE·	78-RKSJ-HaÅAΩOΩQ	ΩSΩVΩ[AÅÅΩmÇ          S           aÉïæPK
       !<aübÿ©   ©   )   chrome/pdfjs/content/web/cmaps/78-V.bcmap‡RCopyright 1990-2009 Adobe Systems Incorporated.
All rights reserved.
See ./LICENSE·78-Ha!"ΩOΩQ	ΩSΩVΩ[A!aΩmÖ?          Å2          a%uæPK
       !<jMÔ“[
  [
  0   chrome/pdfjs/content/web/cmaps/78ms-RKSJ-H.bcmap‡RCopyright 1990-2009 Adobe Systems Incorporated.
All rights reserved.
See ./LICENSE  Å Å@Ω< †?‡@π<  Åg` ]Åg  ÑwaÅ@>Ñy,Ö8ÖeÖmÖtÜ ÜR	ÜÜÜ0RÜJN>áá\ásài à#àDàSQ Ñü∫7	w	WE$$aá@ªqá_ª! æf ª$ æh ª& æjª( ælª+ ækª. æoª1aá~ ¡q	áÄª8 æw
ª= Öz Öy ÜªH Ü ªOqàü àe ªQàg ¿Jàn æ π"àx ªR1â  ªSâ3 ªTâ8 ªUâAqâ@âC ªV	âM ªWâX ªXâ\ ªZâ` ª[âeqâÄ
ä ª\ä ª] πI ª^4ä+ ª_äa ª`ä{ ªa ä~aä@ ä  ªb ã  ≤a ã!  ß ã(qäÄã> ªcãD ªdãJ ªeãR Æ1ãU ªf$ãY ªg ™rå  ªhå
 ¥ å ªiå"aã@	å;  ªj åF  ªk å[qãÄåz ªlç ªmç# ∫2ç? ªnçH ªoçf ªpçm ªq çt ªr çvqå@çw ªsç{ ªté ªué ªvé% ªwé) ªxé, ∏é2qåÄé6 ªyé; ªzéH ª{éP ª|éU ª}éi ª~<évq	ç@	è3 ª
è> º 	èJ ºèU ≠]èoqçÄèr ºê  ºê º6ê ºêD ºêX º	êeq	é@êo ºêv º	 êy º
ê{ º%ëaéÄEë.ëvííC	í+	í6(íAaé« ≤)aé∆ º ººm º
 ºqèÄíjºíxºí~ ºì º
ì ºì( ºì> ºìH ºìMaê@ìg  º -ìq  º î qêÄ ºî' º î0 º!îG º""îg º#	ïº$ïº&ïqë@ï# º( ¥nï+ º)ï< º*ïO º+ïR º,qëÄïb º-0ïl º.ñ º/ñ. º0ñ= º1
ñD º2ñPº3ñW º5 ñ^q	í@ñ_ º6 ñfº7ñiº9ñm º;!ñ|qíÄó º<ó/ º=ó4 º>ó; º?	óZ º@ óe ºAóg ºB ój ºCól ¿Kóq £5"óxqì@ ò ºDò ºEò" ºFò) ºGò1 ºHò: ºIòC ºJòFºKòM ≠_òRqìÄòZ ºMò_ ®Pòi ™6òn ºN"òs ºOô ºPôºQô.ºSô5 ºUô:ºVô@ ºX
ôC µmôOaî@ôW  ºY ô`  ºZ ôp  º[ öqîÄö º\ ≥	 º]ö  º^ö$ º_ö9 º` öC ºa"öE ºböi ºcöw ºdõ
qï@ õºe
õ ºg ®; õ# ºhõ% ºi	õ( ºjõ3 ºkõA ºlõDq	ïÄ@õR ºmú ºnú ºoú+ ºpúJañ@ úO  ºq úQ  ºr  úX  ºs úzqñÄ	ù ∫3ù ºtù æ, †/0ù( ºu
ùZ ºvùf ºwùl ºxùo ≤5 ºy û ºz û	 º{q	ó@û º|û º}û; º~û? ∫4ûEaóÄûJ>ûT-üüDDüHüXü]ü`,4üz  ù' '†0aòU Æwaóâ º? Ω .ΩF Ω Ω Ωq	ô@†X Ω†u Ω† Ω ° Ω	°aö‚ ówaôÄ|°C¢¢$"¢. ¢R
¢S5¢_££6C£P!£m§§[§0C>•!•KY•nC>¶Ha	öO Ω
	 Ω# Ω Ω6 ΩÅ Ω& Ω ΩÇ Ωq
ùÄ Ω
ß Ω
ß ã'ß  Ωß? Ω0ßSaüÛ ãaû@#®®)®.  õ" ®<
®C ®O  òh ®Qg®XC>©@6©  òm ™7#™N™saûd Ω Ω! Ω ΩÇ9 Ω`†?ÇFa‡@>™|#´;7´`¨¨0C	¨8¨C-¨Ia‡Ù ∫5a‡§ Ω8 Ω l Ω!Ω"q	·Ä(¨w Ω$;≠! èn ≠^ òQ≠` Ω%≠ea‚@(≠t  Ω& Æ  Ω' Æ(  ãT  Æ2q	‚Ä6Æ3 Ω(Æk ü\Æx Ω)Ø Ω*Ø a„@Ø0  Ω+  ØI  Ω, 	ØK  Ω- ØVCØo  Ω. 7∞4C>∞lq‰Ä±+ Ω/±0 Ω0±5 Ω1±> Ω2±^ Ω37±e Ω4	≤aÂ@ ≤(  ëu 
≤*  û *≤6  ã  ≤bq	ÂÄ!≤g ö≥
 Ω6≥ Ω70≥# Ω8≥UaÊ@≥d  Ω9 )≥v  å ¥!qÊÄ¥# Ω:¥* Ω;3¥: ï*¥o Ω<	µ Ω=	µaÁ@,µ   Ω> µNqÁÄµ_ Ω? µl Ω@µn ΩA∂ ΩB∂ ΩC&∂5aË@>∂\q
ËÄB∑ ΩF
∑_ ΩG∑k ΩH∑q é1 ΩI∏aÈ@>∏q
ÈÄ*∏W ΩJπ ΩKπ àw ΩL$π$ ä)	πJaÓ˘ ÖoaÌ¥ èIaÍ@/πT  ΩM ∫∫  ΩN ∫1 ¿\Ö>¡'3¡fG¬C>¬bl√!	øæEq	˙@	ø	ª ÖoæE ªB ª: æw Ü "¡'a˙ÄO¡J  èI +¬C>¬F|√CƒPK
       !<!ìÈ8"  "  0   chrome/pdfjs/content/web/cmaps/78ms-RKSJ-V.bcmap‡RCopyright 1990-2009 Adobe Systems Incorporated.
All rights reserved.
See ./LICENSE·78ms-RKSJ-HaÅ® Öc  Öb Ö`aÅAΩOΩQ	ΩSΩVΩ[ ΩmaÅC ¿L  ¿RAÅ¨¿NÅrÖA         S           aÉïæQ Ñü∫9	>1>s"	F1N9/B%$7Bqá_æ ¡	 æ ¡ æ	 ¡æ ¡æ ¡æ ¡aáÄæPK
       !<—˚Llâ  â  0   chrome/pdfjs/content/web/cmaps/83pv-RKSJ-H.bcmap‡RCopyright 1990-2009 Adobe Systems Incorporated.
All rights reserved.
See ./LICENSE  Å Å@Ω< †?‡@π< ˝  ` ^ aaÅ@>Ñy,Ö8ÖeÖmÖtÜ ÜR	ÜÜÜ0RÜJN>áá\ásài à#àDàSQ Ñü∫7	w	WE$$aÖ@>Åh É Ç( >ÇG ÉC>É&Ée  Ç' ÉwÅq Öz  Öy  Ü Ü a/àü]àeC>âC|äC>ä|ã>C>å;|åzC>çw|é6C>è3|èrC>êo|ë.C>í+|íjC>ìg|î&C>ï#|ïbC>ñ_|óC>ò|òZC>ôW|öC>õ|õRC>úO|ùC>û|ûJC2üG,]üzC>†X|°C>¢|¢SC>£P|§C>•|•KC>¶H|ßC>®|®CC>©@|©aÜ¢K∫7Rªª!
ª8ªHªO`†?ÇFa‡@>™||´;a·@>¨8|¨wC>≠t|Æ3C>Ø0|ØoC>∞l|±+C>≤(|≤gC>≥d|¥#C>µ |µ_C>∂\|∑C>∏|∏WC>πT"∫aÍ£¿\qÎ@ ÑyΩOÑ|ΩQÖΩSÖΩVÖΩ[Ö4aÎÄ Ö8  Ωm *Ö:ÖeÖmÖtÜ ÜR	ÜÜÜ0Q	ÏüΩnÓGÓFÓEÓDÓCÓBÓAÓ@qÏ®ÜS ΩsÜm Ωt á Ωu á Ωvá ΩwáQ	Ì@ΩxÌ5Ì4Ì3Ì2Ì1Ì0Ì/Ì.aÌIá&  Ω} á@q
ÌÄá\ Ω~ á` Ω áb æ ád æákæaÌüásàÅ9 Öz  Öy  Ü Ü aÓ@ªª1ª:ªHªOaÓ_ææ`˝ Å  Åd  |PK
       !<#aù—  —  0   chrome/pdfjs/content/web/cmaps/90ms-RKSJ-H.bcmap‡RCopyright 1990-2009 Adobe Systems Incorporated.
All rights reserved.
See ./LICENSE  Å Å@Ω< †?‡@π<  Åg` ]Åg  ÑwaÅ@>Ñy,Ö8ÖeÖmÖtÜ 