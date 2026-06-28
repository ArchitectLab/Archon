/* @ds-bundle: {"format":3,"namespace":"ArchitectLabDesignSystem_61bf68","components":[{"name":"Button","sourcePath":"components/Button/Button.jsx"},{"name":"IconButton","sourcePath":"components/Button/IconButton.jsx"},{"name":"Card","sourcePath":"components/Card/Card.jsx"},{"name":"Eyebrow","sourcePath":"components/Eyebrow/Eyebrow.jsx"},{"name":"GradientRule","sourcePath":"components/GradientRule/GradientRule.jsx"},{"name":"Input","sourcePath":"components/Input/Input.jsx"},{"name":"Logo","sourcePath":"components/Logo/Logo.jsx"},{"name":"Tag","sourcePath":"components/Tag/Tag.jsx"},{"name":"Checkbox","sourcePath":"components/controls/Checkbox.jsx"},{"name":"Radio","sourcePath":"components/controls/Radio.jsx"},{"name":"SegmentedControl","sourcePath":"components/controls/SegmentedControl.jsx"},{"name":"Switch","sourcePath":"components/controls/Switch.jsx"}],"sourceHashes":{"components/Button/Button.jsx":"7b0701c8243f","components/Button/IconButton.jsx":"de5f02f2dfbb","components/Card/Card.jsx":"7d0d4f3869ae","components/Eyebrow/Eyebrow.jsx":"3899bcb6867f","components/GradientRule/GradientRule.jsx":"bcc0ad192952","components/Input/Input.jsx":"bd8510fdc9e6","components/Logo/Logo.jsx":"121cf1e03e66","components/Tag/Tag.jsx":"93fd045285e0","components/controls/Checkbox.jsx":"f1c1b61d2029","components/controls/Radio.jsx":"796b870c71d5","components/controls/SegmentedControl.jsx":"f6c9d807f2fb","components/controls/Switch.jsx":"d46c03d8fcda","motion/al-scroll.js":"dc298f232ee1","ui_kits/website/site.jsx":"0bb25e5a091b"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ArchitectLabDesignSystem_61bf68 = window.ArchitectLabDesignSystem_61bf68 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/Button/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Architect Lab — Button
 * The primary action carries the spectrum; everything else stays
 * blueprint-quiet. Corners are crisp, the focus ring glows blue.
 */
function Button({
  children,
  variant = 'primary',
  // 'primary' | 'secondary' | 'ghost' | 'spectrum'
  size = 'md',
  // 'sm' | 'md' | 'lg'
  fx,
  // 'sweep' | 'glow' | 'scanline' | 'draw' — animated accents
  iconLeft,
  iconRight,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  style,
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '8px 14px',
      fontSize: 13,
      gap: 6
    },
    md: {
      padding: '11px 20px',
      fontSize: 15,
      gap: 8
    },
    lg: {
      padding: '15px 28px',
      fontSize: 17,
      gap: 10
    }
  };
  const s = sizes[size] || sizes.md;
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    padding: s.padding,
    fontSize: s.fontSize,
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
    fontWeight: 600,
    lineHeight: 1,
    letterSpacing: '-0.01em',
    border: '1px solid transparent',
    borderRadius: 'var(--al-radius-sm, 6px)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'background .15s ease, border-color .15s ease, color .15s ease, transform .05s ease, box-shadow .25s ease',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    position: 'relative',
    overflow: 'hidden'
  };
  const variants = {
    primary: {
      background: '#2A6BF2',
      color: '#F5F7FA',
      borderColor: '#2A6BF2'
    },
    spectrum: {
      background: 'linear-gradient(90deg,#2ECC9A 0%,#2A6BF2 38%,#8A2BE2 70%,#E612D9 100%)',
      color: '#FFFFFF',
      borderColor: 'transparent'
    },
    secondary: {
      background: 'transparent',
      color: '#F5F7FA',
      borderColor: '#3A4A66'
    },
    ghost: {
      background: 'transparent',
      color: '#8B97A8',
      borderColor: 'transparent'
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    className: (fx ? 'al-fx--' + fx : '') + (className ? ' ' + className : ''),
    style: {
      ...base,
      ...(variants[variant] || variants.primary),
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'translateY(1px)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'translateY(0)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'translateY(0)';
    }
  }, rest), iconLeft ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-flex'
    }
  }, iconLeft) : null, children, iconRight ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-flex'
    }
  }, iconRight) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Button/Button.jsx", error: String((e && e.message) || e) }); }

// components/Button/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Architect Lab — IconButton
 * A square, blueprint-quiet button for a single icon. Outline by
 * default; hover lights the spectrum-blue border.
 */
function IconButton({
  children,
  variant = 'outline',
  // 'outline' | 'ghost'
  size = 'md',
  // 'sm' | 'md' | 'lg'
  label,
  disabled = false,
  className = '',
  style,
  ...rest
}) {
  const cls = ['al-iconbtn', variant === 'ghost' ? 'al-iconbtn--ghost' : '', size === 'sm' ? 'al-iconbtn--sm' : size === 'lg' ? 'al-iconbtn--lg' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    disabled: disabled,
    className: cls,
    style: style
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Button/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/Card/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Architect Lab — Card
 * A panel raised off the void. The optional `accent` prints a spectrum
 * hairline along the top — the construction-line motif.
 */
function Card({
  children,
  accent = false,
  // false | true (spectrum top rule) | 'left'
  blueprint = false,
  // print the 48px grid inside the card
  padding = 24,
  style,
  ...rest
}) {
  const base = {
    position: 'relative',
    background: blueprint ? '#0B1220' : '#111A2C',
    backgroundImage: blueprint ? 'linear-gradient(#1E2A40 1px, transparent 1px), linear-gradient(90deg, #1E2A40 1px, transparent 1px)' : 'none',
    backgroundSize: blueprint ? '48px 48px' : 'auto',
    border: '1px solid #1E2A40',
    borderRadius: 12,
    padding,
    overflow: 'hidden'
  };
  const topRule = accent === true && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      background: 'linear-gradient(90deg,#2ECC9A,#2A6BF2,#8A2BE2,#E612D9)'
    }
  });
  const leftRule = accent === 'left' && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: 3,
      background: 'linear-gradient(180deg,#2ECC9A,#2A6BF2,#8A2BE2,#E612D9)'
    }
  });
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      ...base,
      ...style
    }
  }, rest), topRule, leftRule, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Card/Card.jsx", error: String((e && e.message) || e) }); }

// components/Eyebrow/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Architect Lab — Eyebrow
 * The section label: a short spectrum tick followed by tracked,
 * uppercase display text. The "02 — Le logo" pattern from the charte.
 */
function Eyebrow({
  children,
  color = '#2A6BF2',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: 14,
      fontWeight: 500,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 34,
      height: 2,
      background: 'linear-gradient(90deg,#2ECC9A,#2A6BF2,#8A2BE2,#E612D9)'
    }
  }), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Eyebrow/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/GradientRule/GradientRule.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Architect Lab — GradientRule
 * The signature spectrum bar. Use under titles, as a section break,
 * or as a thin progress/track element. Keep it to a sliver — the
 * spectrum should stay under ~10% of any composition.
 */
function GradientRule({
  width = '100%',
  height = 4,
  vertical = false,
  rounded = true,
  print = false,
  // use the print-safe (darkened) spectrum
  style,
  ...rest
}) {
  const spectrum = print ? 'linear-gradient(90deg,#1FA87C,#2A6BF2,#8A2BE2,#D012C8)' : 'linear-gradient(90deg,#2ECC9A,#2A6BF2,#8A2BE2,#E612D9)';
  const spectrumV = print ? 'linear-gradient(180deg,#1FA87C,#2A6BF2,#8A2BE2,#D012C8)' : 'linear-gradient(180deg,#2ECC9A,#2A6BF2,#8A2BE2,#E612D9)';
  return /*#__PURE__*/React.createElement("span", _extends({
    "aria-hidden": "true",
    style: {
      display: 'block',
      width: vertical ? height : width,
      height: vertical ? width : height,
      background: vertical ? spectrumV : spectrum,
      borderRadius: rounded ? 999 : 0,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { GradientRule });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/GradientRule/GradientRule.jsx", error: String((e && e.message) || e) }); }

// components/Input/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Architect Lab — Input
 * Quiet on the void, with a mono label. Focus lights the spectrum-blue
 * ring. Pairs with a leading prompt glyph for terminal-style fields.
 */
function Input({
  label,
  hint,
  prefix,
  // e.g. "$" or ">" for terminal fields
  invalid = false,
  id,
  style,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const autoId = React.useId ? React.useId() : 'al-in';
  const inputId = id || autoId;
  const borderColor = invalid ? '#E612D9' : focused ? '#2A6BF2' : '#1E2A40';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7,
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 11,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: '#8B97A8'
    }
  }, label) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: '#0B1220',
      border: `1px solid ${borderColor}`,
      borderRadius: 6,
      padding: '0 12px',
      boxShadow: focused ? '0 0 0 3px rgba(42,107,242,0.25)' : 'none',
      transition: 'border-color .15s ease, box-shadow .15s ease'
    }
  }, prefix ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontFamily: "'JetBrains Mono', monospace",
      color: '#2ECC9A',
      fontSize: 15
    }
  }, prefix) : null, /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    onFocus: e => {
      setFocused(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocused(false);
      rest.onBlur && rest.onBlur(e);
    }
  }, rest, {
    style: {
      flex: 1,
      minWidth: 0,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: '#F5F7FA',
      fontFamily: "'Inter', sans-serif",
      fontSize: 15,
      padding: '11px 0'
    }
  }))), hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 12.5,
      color: invalid ? '#E612D9' : '#8B97A8'
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Input/Input.jsx", error: String((e && e.message) || e) }); }

// components/Logo/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Architect Lab — Logo
 * The Morphaius spectrum bowtie: an outlined hourglass whose stroke
 * carries green → blue → violet → magenta. The mark never tilts,
 * the spectrum never reverses.
 *
 * variant: 'mark' | 'horizontal' | 'stacked'
 * tone:    'spectrum' (default) | 'mono-light' (white) | 'mono-dark' (void)
 */
function Logo({
  variant = 'horizontal',
  tone = 'spectrum',
  size = 40,
  // height of the mark in px
  wordmark = 'ARCHITECT LAB',
  baseline = 'DESIGN · BUILD · PROTECT',
  style,
  ...rest
}) {
  const gid = React.useId ? React.useId().replace(/:/g, '') : 'al' + Math.random().toString(36).slice(2);
  const stroke = tone === 'mono-light' ? '#F5F7FA' : tone === 'mono-dark' ? '#0B1220' : `url(#alspec-${gid})`;
  const wordColor = tone === 'mono-dark' ? '#0B1220' : '#F5F7FA';
  const ratio = 120 / 80;
  const w = size * ratio;
  const Mark = /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: size,
    viewBox: "0 0 120 80",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: `alspec-${gid}`,
    x1: "0",
    y1: "1",
    x2: "1",
    y2: "0"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#2ECC9A"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "38%",
    stopColor: "#2A6BF2"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "70%",
    stopColor: "#8A2BE2"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#E612D9"
  }))), /*#__PURE__*/React.createElement("path", {
    d: "M14 14 L60 40 L106 14 L106 66 L60 40 L14 66 Z",
    stroke: stroke,
    strokeWidth: "9",
    strokeLinejoin: "round",
    strokeLinecap: "round"
  }));
  if (variant === 'mark') {
    return /*#__PURE__*/React.createElement("span", _extends({
      role: "img",
      "aria-label": wordmark,
      style: {
        display: 'inline-flex',
        ...style
      }
    }, rest), Mark);
  }
  if (variant === 'stacked') {
    return /*#__PURE__*/React.createElement("span", _extends({
      role: "img",
      "aria-label": wordmark,
      style: {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: size * 0.28,
        ...style
      }
    }, rest), Mark, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        fontSize: size * 0.6,
        letterSpacing: '-0.01em',
        color: wordColor,
        lineHeight: 1
      }
    }, wordmark, /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#E612D9'
      }
    }, "_")), baseline ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: size * 0.26,
        letterSpacing: '0.22em',
        color: '#8B97A8'
      }
    }, baseline) : null));
  }

  // horizontal
  return /*#__PURE__*/React.createElement("span", _extends({
    role: "img",
    "aria-label": wordmark,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: size * 0.42,
      ...style
    }
  }, rest), Mark, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 700,
      fontSize: size * 0.62,
      letterSpacing: '-0.01em',
      color: wordColor,
      lineHeight: 1
    }
  }, wordmark, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#E612D9'
    }
  }, "_")), baseline ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: size * 0.24,
      letterSpacing: '0.22em',
      color: '#8B97A8'
    }
  }, baseline) : null));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Logo/Logo.jsx", error: String((e && e.message) || e) }); }

// components/Tag/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Architect Lab — Tag
 * The mono, uppercase, letter-tracked label. Used for categories,
 * code refs, status and the // eyebrow tags. Optionally spectrum-filled.
 */
function Tag({
  children,
  tone = 'default',
  // 'default' | 'spectrum' | 'green' | 'blue' | 'violet' | 'magenta'
  outlined = true,
  style,
  ...rest
}) {
  const colors = {
    green: '#2ECC9A',
    blue: '#2A6BF2',
    violet: '#8A2BE2',
    magenta: '#E612D9'
  };
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    padding: '3px 9px',
    borderRadius: 999,
    border: outlined ? '1px solid #1E2A40' : '1px solid transparent',
    lineHeight: 1.4,
    whiteSpace: 'nowrap'
  };
  let toneStyle = {
    color: '#8B97A8'
  };
  if (tone === 'spectrum') {
    toneStyle = {
      background: 'linear-gradient(90deg,#2ECC9A,#2A6BF2,#8A2BE2,#E612D9)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent'
    };
  } else if (colors[tone]) {
    toneStyle = {
      color: colors[tone],
      borderColor: outlined ? colors[tone] + '55' : 'transparent'
    };
  }
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      ...base,
      ...toneStyle,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Tag/Tag.jsx", error: String((e && e.message) || e) }); }

// components/controls/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Architect Lab — Checkbox
 * A crisp blueprint square; when checked it fills spectrum-blue and the
 * tick draws itself in. Controlled or uncontrolled.
 */
function Checkbox({
  checked,
  defaultChecked = false,
  onChange,
  label,
  disabled = false,
  className = '',
  style,
  ...rest
}) {
  const [on, setOn] = React.useState(defaultChecked);
  const isControlled = checked !== undefined;
  const val = isControlled ? checked : on;
  const toggle = () => {
    if (disabled) return;
    const next = !val;
    if (!isControlled) setOn(next);
    onChange && onChange(next);
  };
  const cls = ['al-check', val ? 'is-on' : '', disabled ? 'is-disabled' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    role: "checkbox",
    "aria-checked": val,
    disabled: disabled,
    onClick: toggle,
    className: cls,
    style: style
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "al-check__box"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 16 16",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 8.5 L6.5 12 L13 4.5"
  }))), label ? /*#__PURE__*/React.createElement("span", null, label) : null);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/controls/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/controls/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Architect Lab — Radio
 * A single radio; the spectrum dot scales in when selected. For a group,
 * keep one `value` in state and render several with `checked={v === o}`.
 */
function Radio({
  checked,
  defaultChecked = false,
  onChange,
  label,
  name,
  value,
  disabled = false,
  className = '',
  style,
  ...rest
}) {
  const [on, setOn] = React.useState(defaultChecked);
  const isControlled = checked !== undefined;
  const val = isControlled ? checked : on;
  const pick = () => {
    if (disabled) return;
    if (!isControlled) setOn(true);
    onChange && onChange(value !== undefined ? value : true);
  };
  const cls = ['al-radio', val ? 'is-on' : '', disabled ? 'is-disabled' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    role: "radio",
    "aria-checked": val,
    name: name,
    disabled: disabled,
    onClick: pick,
    className: cls,
    style: style
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "al-radio__dot"
  }), label ? /*#__PURE__*/React.createElement("span", null, label) : null);
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/controls/Radio.jsx", error: String((e && e.message) || e) }); }

// components/controls/SegmentedControl.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Architect Lab — SegmentedControl
 * A row of options with a sliding indicator — the "personality switch"
 * from the motion console. Options are strings or {label, value}.
 */
function SegmentedControl({
  options = [],
  value,
  defaultValue,
  onChange,
  tone = 'default',
  // 'default' | 'spectrum'
  className = '',
  style,
  ...rest
}) {
  const opts = options.map(o => typeof o === 'string' ? {
    label: o,
    value: o
  } : o);
  const first = opts[0] ? opts[0].value : undefined;
  const [val, setVal] = React.useState(defaultValue !== undefined ? defaultValue : first);
  const isControlled = value !== undefined;
  const cur = isControlled ? value : val;
  const idx = Math.max(0, opts.findIndex(o => o.value === cur));
  const wrapRef = React.useRef(null);
  const [ind, setInd] = React.useState({
    left: 0,
    width: 0
  });
  const measure = React.useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const btn = wrap.querySelectorAll('.al-seg__opt')[idx];
    if (btn) setInd({
      left: btn.offsetLeft,
      width: btn.offsetWidth
    });
  }, [idx]);
  React.useLayoutEffect(() => {
    measure();
  }, [measure, opts.length]);
  React.useEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);
  const pick = v => {
    if (!isControlled) setVal(v);
    onChange && onChange(v);
  };
  const cls = ['al-seg', tone === 'spectrum' ? 'al-seg--spectrum' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: wrapRef,
    className: cls,
    role: "tablist",
    style: style
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "al-seg__ind",
    style: {
      transform: `translateX(${ind.left}px)`,
      width: ind.width
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: String(o.value),
    type: "button",
    role: "tab",
    "aria-selected": o.value === cur,
    className: 'al-seg__opt' + (o.value === cur ? ' is-active' : ''),
    onClick: () => pick(o.value)
  }, o.label)));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/controls/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/controls/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Architect Lab — Switch
 * On = the spectrum lights the track and the thumb slides; off stays
 * blueprint-quiet. Controlled (pass `checked`) or uncontrolled.
 */
function Switch({
  checked,
  defaultChecked = false,
  onChange,
  label,
  disabled = false,
  className = '',
  style,
  ...rest
}) {
  const [on, setOn] = React.useState(defaultChecked);
  const isControlled = checked !== undefined;
  const val = isControlled ? checked : on;
  const toggle = () => {
    if (disabled) return;
    const next = !val;
    if (!isControlled) setOn(next);
    onChange && onChange(next);
  };
  const cls = ['al-switch', val ? 'is-on' : '', disabled ? 'is-disabled' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    role: "switch",
    "aria-checked": val,
    "aria-label": typeof label === 'string' ? label : undefined,
    disabled: disabled,
    onClick: toggle,
    className: cls,
    style: style
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "al-switch__track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "al-switch__thumb"
  })), label ? /*#__PURE__*/React.createElement("span", null, label) : null);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/controls/Switch.jsx", error: String((e && e.message) || e) }); }

// motion/al-scroll.js
try { (() => {
/* ============================================================
   ARCHITECT LAB — Motion engine · al-scroll.js
   Powers the "Materialisation" scroll system. Vanilla JS, no deps.

   Reveals are driven by a scroll/resize/rAF check against
   getBoundingClientRect (NOT IntersectionObserver — so it runs
   identically in previews, exports and real browsers). Also scrubs
   scroll progress for the rail + parallax, runs count-ups + typing.

   Drop-in: add the data-* attributes (see al-scroll.css), then
   <script src="al-scroll.js"></script> near the end of <body>.

   Public API (also works on slides — call reveal() on a slide root):
     AL.motion.observe(scope)   index [data-al] inside scope + check now
     AL.motion.reveal(el)       force an element (+ its [data-al]
                                children) to their final state now
     AL.motion.reset(el)        re-arm for replay
     AL.motion.refresh()        re-scan DOM + re-measure + re-check
   ============================================================ */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.AL = window.AL || {};
  var items = []; // revealable elements
  var parallax = []; // scrubbed depth elements
  var SEL = '[data-al], [data-al-count], [data-al-type]';

  /* ---------- helpers ---------- */
  function measureDraw(scope) {
    scope.querySelectorAll('[data-al="draw"]').forEach(function (p) {
      if (p.__len) return;
      try {
        var len = p.getTotalLength();
        if (len) {
          p.style.setProperty('--len', len);
          p.__len = len;
        }
      } catch (e) {}
    });
  }
  function applyStagger(scope) {
    scope.querySelectorAll('[data-al-stagger]').forEach(function (par) {
      if (par.__staggered) return;
      par.__staggered = true;
      var step = parseFloat(par.getAttribute('data-al-stagger')) || 90;
      var i = 0;
      par.querySelectorAll('[data-al]').forEach(function (it) {
        if (it.closest('[data-al-stagger]') !== par) return;
        it.style.setProperty('--al-delay', i * step + 'ms');
        i++;
      });
    });
  }
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-al-count'));
    if (isNaN(target)) return;
    var dur = parseFloat(el.getAttribute('data-al-count-dur')) || 1100;
    var dec = (String(el.getAttribute('data-al-count')).split('.')[1] || '').length;
    if (reduce) {
      el.textContent = target.toFixed(dec);
      return;
    }
    var start = performance.now();
    (function tick(now) {
      var t = Math.min(1, (now - start) / dur);
      var e = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * e).toFixed(dec);
      if (t < 1) requestAnimationFrame(tick);else el.textContent = target.toFixed(dec);
    })(start);
  }
  function typeOut(el) {
    if (el.__typed) return;
    el.__typed = true;
    var text = el.getAttribute('data-al-type') || el.__rawText || el.textContent;
    el.__rawText = text;
    var speed = parseFloat(el.getAttribute('data-al-type-speed')) || 34;
    var caret = el.getAttribute('data-al-type-caret') !== 'false';
    el.textContent = '';
    var span = document.createElement('span');
    el.appendChild(span);
    var car;
    if (caret) {
      car = document.createElement('span');
      car.className = 'al-caret';
      car.textContent = '▌';
      el.appendChild(car);
    }
    if (reduce) {
      span.textContent = text;
      return;
    }
    var i = 0;
    (function step() {
      span.textContent = text.slice(0, i);
      if (i++ <= text.length) setTimeout(step, speed);
    })();
  }
  function activate(el) {
    if (el.classList.contains('is-in')) return;
    el.classList.add('is-in');
    if (el.hasAttribute('data-al-count')) countUp(el);
    if (el.hasAttribute('data-al-type')) typeOut(el);
  }
  function deactivate(el) {
    el.classList.remove('is-in');
    el.__typed = false;
  }

  /* ---------- collect ---------- */
  function collect(scope) {
    scope = scope || document;
    measureDraw(scope);
    applyStagger(scope);
    scope.querySelectorAll(SEL).forEach(function (el) {
      if (el.__al) return;
      el.__al = true;
      items.push(el);
    });
    parallax = Array.prototype.slice.call(document.querySelectorAll('[data-al-parallax]'));
  }

  /* ---------- the reveal check (rect-based) ---------- */
  function check() {
    var vh = window.innerHeight || root.clientHeight;
    var enter = vh * 0.86,
      exit = vh * 0.04;
    for (var i = 0; i < items.length; i++) {
      var el = items[i];
      var r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0 && r.top === 0) continue; // not laid out yet
      var inView = r.top < enter && r.bottom > exit;
      if (reduce) {
        activate(el);
        continue;
      }
      if (inView) activate(el);else if (el.hasAttribute('data-al-repeat')) deactivate(el);
    }
  }

  /* ---------- scrubbed scroll: rail + parallax ---------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var max = root.scrollHeight - root.clientHeight;
      var y = window.scrollY || window.pageYOffset || 0;
      var p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      root.style.setProperty('--al-progress', p);
      if (!reduce) {
        var vh = window.innerHeight;
        for (var i = 0; i < parallax.length; i++) {
          var el = parallax[i];
          var f = parseFloat(el.getAttribute('data-al-parallax')) || 0.15;
          var r = el.getBoundingClientRect();
          var off = (r.top + r.height / 2 - vh / 2) * -f;
          el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
        }
      }
      check();
      ticking = false;
    });
  }

  /* ---------- public API ---------- */
  AL.motion = {
    observe: function (scope) {
      collect(scope);
      check();
    },
    reveal: function (el) {
      if (!el) return;
      if (el.matches && el.matches(SEL)) activate(el);
      el.querySelectorAll && el.querySelectorAll(SEL).forEach(activate);
    },
    reset: function (el) {
      if (!el) return;
      var list = el.matches && el.matches('[data-al]') ? [el] : [];
      el.querySelectorAll && el.querySelectorAll('[data-al]').forEach(function (n) {
        list.push(n);
      });
      list.forEach(deactivate);
    },
    refresh: function () {
      collect(document);
      onScroll();
    }
  };

  /* ---------- boot ---------- */
  function inInitialView(el) {
    var r = el.getBoundingClientRect();
    return r.top < (window.innerHeight || root.clientHeight) * 0.98 && r.bottom > -4;
  }

  // When the page can't be scrolled (e.g. an embedded/auto-height host),
  // play the materialisation section-by-section so nothing stays hidden
  // and the signature effect is still seen. Cancelled if a real scroll
  // happens first (then it's scroll-driven, as on a normal website).
  var cascaded = false;
  function autoCascade() {
    if (cascaded) return;
    cascaded = true;
    var secs = Array.prototype.slice.call(document.querySelectorAll('[data-al-section], section'));
    var i = 0;
    (function next() {
      if (i >= secs.length) return;
      AL.motion.reveal(secs[i]);
      i++;
      setTimeout(next, 900);
    })();
  }
  function boot() {
    // Arm the page (enables hidden start-states) then reveal the first
    // screen in the SAME task — so above-the-fold paints visible directly,
    // never stuck at opacity:0 even if transitions are frozen (capture/PDF).
    root.classList.add('al-ready');
    collect(document);
    void document.body.offsetHeight; // force layout → real rects
    items.forEach(function (el) {
      if (inInitialView(el)) activate(el);
    });
    onScroll();
    var scrolled = false;
    window.addEventListener('scroll', function () {
      scrolled = true;
      onScroll();
    }, {
      passive: true
    });
    window.addEventListener('resize', function () {
      items.forEach(function (el) {
        el.__len = 0;
      });
      measureDraw(document);
      onScroll();
    }, {
      passive: true
    });

    // Can the document actually scroll here?
    var se = document.scrollingElement || root;
    var canScroll;
    try {
      var b = se.scrollTop;
      se.scrollTop = b + 2;
      canScroll = se.scrollTop !== b;
      se.scrollTop = b;
    } catch (e) {
      canScroll = true;
    }
    var overflowing = root.scrollHeight - root.clientHeight > 8;
    setTimeout(check, 140);
    setTimeout(function () {
      measureDraw(document);
      check();
    }, 520);
    // If there's content below the fold but no way to scroll to it, self-play.
    if (!reduce && overflowing && !canScroll) {
      setTimeout(function () {
        if (!scrolled) autoCascade();
      }, 1100);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);else boot();
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "motion/al-scroll.js", error: String((e && e.message) || e) }); }

// ui_kits/website/site.jsx
try { (() => {
/* Architect Lab — Website UI kit
   A forward design for the marketing site, composed from the system's
   own primitives (Button, Logo, Card, Tag, GradientRule, Eyebrow, Input).
   The repo had no production UI; this is built from the brand charter. */

const AL = window.ArchitectLabDesignSystem_61bf68;
const {
  Button,
  Logo,
  Card,
  Tag,
  GradientRule,
  Eyebrow,
  Input
} = AL;
const ink = {
  paper: '#F5F7FA',
  slate: '#8B97A8',
  void: '#0B1220',
  panel: '#111A2C',
  line: '#1E2A40'
};

/* Responsive layout — injected once. Columns/paddings live here so they can
   collapse at breakpoints; visual styling stays inline on the components.
   Content stays centred (max-width) on super-wide screens for a good measure. */
const RESPONSIVE_CSS = `
  .als-nav { padding: 18px 40px; }
  .als-hero { padding: 110px 40px 96px; }
  .als-section { padding: 96px 40px; }
  .als-tracks { padding: 0 40px 96px; }
  .als-mentors { padding: 34px 40px; }
  .als-join { padding: 100px 40px; }
  .als-footer { padding: 56px 40px 36px; }
  .als-grid3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; margin-top: 36px; }
  .als-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .als-foot  { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 40px; }
  .als-term  { max-width: 100%; }
  @media (min-width: 1700px) {
    .als-hero, .als-section, .als-tracks, .als-join { padding-left: 72px; padding-right: 72px; }
  }
  @media (max-width: 1024px) {
    .als-grid3 { grid-template-columns: repeat(2,1fr); }
  }
  @media (max-width: 760px) {
    .als-nav { padding: 14px 20px; }
    .als-navlinks { display: none !important; }
    .als-hero { padding: 84px 22px 64px; }
    .als-section { padding: 72px 22px; }
    .als-tracks { padding: 0 22px 72px; }
    .als-mentors { padding: 26px 22px; }
    .als-join { padding: 72px 22px; }
    .als-footer { padding: 48px 22px 30px; }
    .als-grid3, .als-grid2, .als-foot { grid-template-columns: 1fr; }
    .als-foot { gap: 30px; }
    .als-term { flex-wrap: wrap; }
  }
`;

/* ---------------- Icon (Lucide) ---------------- */
function Icon({
  name,
  size = 20,
  color = ink.paper,
  stroke = 1.75,
  style
}) {
  return /*#__PURE__*/React.createElement("i", {
    "data-lucide": name,
    style: {
      width: size,
      height: size,
      color,
      strokeWidth: stroke,
      display: 'inline-flex',
      ...style
    }
  });
}

/* ---------------- Nav ---------------- */
function Nav() {
  const links = ['Programs', 'Method', 'Mentors', 'Open source'];
  return /*#__PURE__*/React.createElement("nav", {
    className: "als-nav",
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${ink.line}`,
      background: 'rgba(11,18,32,0.82)',
      backdropFilter: 'blur(8px)'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "horizontal",
    tone: "spectrum",
    size: 30,
    baseline: ""
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "als-navlinks",
    style: {
      display: 'flex',
      gap: 26
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 14,
      fontWeight: 500,
      color: ink.slate,
      textDecoration: 'none',
      transition: 'color .15s'
    },
    onMouseEnter: e => e.currentTarget.style.color = ink.paper,
    onMouseLeave: e => e.currentTarget.style.color = ink.slate
  }, l))), /*#__PURE__*/React.createElement(Button, {
    variant: "spectrum",
    size: "sm",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 15,
      color: "#fff"
    }),
    onClick: () => {
      location.hash = '#join';
    }
  }, "Join the Lab")));
}

/* ---------------- Hero ---------------- */
function Hero() {
  return /*#__PURE__*/React.createElement("header", {
    className: "al-blueprint als-hero",
    style: {
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      top: -160,
      right: -120,
      width: 520,
      height: 520,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(138,43,226,0.20), rgba(230,18,217,0.06) 45%, transparent 70%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1160,
      margin: '0 auto',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "AI \xD7 Cybersecurity \xB7 Open source"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'clamp(40px, 7vw, 76px)',
      lineHeight: 1.04,
      margin: '22px 0 0',
      maxWidth: 920,
      letterSpacing: '-0.03em'
    }
  }, "Build the future.", /*#__PURE__*/React.createElement("br", null), "Be an ", /*#__PURE__*/React.createElement("span", {
    className: "al-spectrum-text"
  }, "architect"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#E612D9'
    }
  }, "_")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'Inter',sans-serif",
      fontSize: 'clamp(16px, 2.3vw, 20px)',
      lineHeight: 1.6,
      color: ink.slate,
      maxWidth: 640,
      margin: '26px 0 0'
    }
  }, "Architect Lab is an open-source association where the next generation designs, builds and protects \u2014 mentored by the engineers of ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: ink.paper,
      fontWeight: 600
    }
  }, "Morphaius"), " & ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: ink.paper,
      fontWeight: 600
    }
  }, "Bunkerity"), "."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      marginTop: 38,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "spectrum",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 17,
      color: "#fff"
    }),
    onClick: () => location.hash = '#join'
  }, "Join the Lab"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "terminal",
      size: 16,
      color: ink.paper
    })
  }, "Explore projects")), /*#__PURE__*/React.createElement("div", {
    className: "als-term",
    style: {
      marginTop: 56,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      background: ink.void,
      border: `1px solid ${ink.line}`,
      borderRadius: 8,
      padding: '12px 18px',
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#2ECC9A'
    }
  }, "$"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: ink.paper,
      overflowWrap: 'anywhere',
      minWidth: 0
    }
  }, "git clone github.com/architect-lab/domaius"), /*#__PURE__*/React.createElement("span", {
    className: "al-cursor"
  }, "\u258C"))));
}

/* ---------------- Pillars: Design / Build / Protect ---------------- */
function Pillars() {
  const items = [{
    n: '01',
    t: 'Design',
    icon: 'pen-tool',
    body: 'Map the threat, sketch the system. Architecture before code — the plan on the grid.'
  }, {
    n: '02',
    t: 'Build',
    icon: 'blocks',
    body: 'Ship open-source tools in real squads, reviewed by working engineers. Learn by shipping.'
  }, {
    n: '03',
    t: 'Protect',
    icon: 'shield',
    body: 'Red-team your own work. Security is not a phase — it is the foundation we pour first.'
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "als-section",
    style: {
      maxWidth: 1160,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    color: "#8A2BE2"
  }, "The method"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(30px, 4.6vw, 40px)',
      margin: '16px 0 8px'
    }
  }, "Design. Build. Protect."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: ink.slate,
      maxWidth: 560,
      margin: 0,
      fontFamily: "'Inter',sans-serif",
      fontSize: 16
    }
  }, "One loop, repeated until it's second nature."), /*#__PURE__*/React.createElement("div", {
    className: "als-grid3"
  }, items.map(it => /*#__PURE__*/React.createElement(Card, {
    key: it.n,
    accent: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.icon,
    size: 26,
    color: ink.paper,
    stroke: 1.5
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 12,
      color: ink.slate,
      letterSpacing: '.16em'
    }
  }, it.n)), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 24,
      margin: '18px 0 8px'
    }
  }, it.t), /*#__PURE__*/React.createElement("p", {
    style: {
      color: ink.slate,
      fontSize: 14.5,
      lineHeight: 1.6,
      margin: 0,
      fontFamily: "'Inter',sans-serif"
    }
  }, it.body)))));
}

/* ---------------- Tracks: AI / Cybersecurity ---------------- */
function Tracks() {
  const tracks = [{
    tag: 'Track 01',
    tone: 'blue',
    t: 'Artificial Intelligence',
    body: 'From first model to production agents — applied ML, evaluation, and the safety mindset that keeps it honest.',
    chips: ['LLM agents', 'Evals', 'MLOps', 'Open weights']
  }, {
    tag: 'Track 02',
    tone: 'magenta',
    t: 'Cybersecurity',
    body: 'Offensive and defensive in the same hands. Build the bunker, then try to break it.',
    chips: ['Red team', 'AppSec', 'Reverse eng.', 'Hardening']
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "als-tracks",
    style: {
      maxWidth: 1160,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "The programs"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(30px, 4.6vw, 40px)',
      margin: '16px 0 28px'
    }
  }, "Two tracks, one architect"), /*#__PURE__*/React.createElement("div", {
    className: "als-grid2"
  }, tracks.map(tr => /*#__PURE__*/React.createElement(Card, {
    key: tr.t,
    blueprint: true,
    padding: 30,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    tone: tr.tone
  }, tr.tag), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 28,
      margin: 0
    }
  }, tr.t), /*#__PURE__*/React.createElement("p", {
    style: {
      color: ink.slate,
      fontSize: 15,
      lineHeight: 1.6,
      margin: 0,
      fontFamily: "'Inter',sans-serif",
      maxWidth: 420
    }
  }, tr.body), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      marginTop: 4
    }
  }, tr.chips.map(c => /*#__PURE__*/React.createElement(Tag, {
    key: c
  }, c))), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      marginTop: 8,
      fontFamily: "'Space Grotesk',sans-serif",
      fontWeight: 600,
      fontSize: 14,
      color: '#2A6BF2',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, "View curriculum ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-up-right",
    size: 15,
    color: "#2A6BF2"
  }))))));
}

/* ---------------- Mentors strip ---------------- */
function Mentors() {
  return /*#__PURE__*/React.createElement("section", {
    className: "als-mentors",
    style: {
      borderTop: `1px solid ${ink.line}`,
      borderBottom: `1px solid ${ink.line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1160,
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      gap: 40,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 11,
      letterSpacing: '.2em',
      textTransform: 'uppercase',
      color: ink.slate
    }
  }, "Mentored\xA0by"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "mark",
    size: 26
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Space Grotesk',sans-serif",
      fontWeight: 700,
      fontSize: 22,
      color: ink.paper
    }
  }, "Morphaius")), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 26,
      background: ink.line
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Space Grotesk',sans-serif",
      fontWeight: 700,
      fontSize: 22,
      color: ink.paper
    }
  }, "Bunkerity"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Inter',sans-serif",
      fontSize: 14,
      color: ink.slate
    }
  }, "Working engineers. Real reviews. Open source.")));
}

/* ---------------- Join CTA (interactive) ---------------- */
function Join() {
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  return /*#__PURE__*/React.createElement("section", {
    id: "join",
    className: "al-blueprint als-join",
    style: {
      borderTop: `1px solid ${ink.line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    color: "#2ECC9A",
    style: {
      justifyContent: 'center'
    }
  }, "Cohort 2026 \u2014 open"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(34px, 5.4vw, 48px)',
      margin: '20px 0 12px',
      letterSpacing: '-0.02em'
    }
  }, "Request access", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#E612D9'
    }
  }, "_")), /*#__PURE__*/React.createElement("p", {
    style: {
      color: ink.slate,
      fontSize: 17,
      margin: '0 auto 32px',
      maxWidth: 480,
      fontFamily: "'Inter',sans-serif"
    }
  }, "No tuition, no gatekeeping. Tell us where to reach you and we'll send the entry brief."), /*#__PURE__*/React.createElement(Card, {
    padding: 28,
    style: {
      textAlign: 'left',
      maxWidth: 520,
      margin: '0 auto'
    }
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 15,
      color: '#2ECC9A',
      padding: '14px 4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: ink.slate
    }
  }, "$"), " access requested for ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: ink.paper
    }
  }, email), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#2ECC9A'
    }
  }, "\u2192 entry brief sent."), " ", /*#__PURE__*/React.createElement("span", {
    className: "al-cursor"
  }, "\u258C")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-end',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 240
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    prefix: ">",
    placeholder: "you@domain.org",
    value: email,
    onChange: e => setEmail(e.target.value)
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "spectrum",
    size: "lg",
    disabled: !valid,
    onClick: () => setSent(true)
  }, "Request"))), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 18,
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 12,
      color: ink.slate,
      letterSpacing: '.04em'
    }
  }, "OPEN SOURCE \xB7 OFL & MIT \xB7 NO FEES")));
}

/* ---------------- Footer ---------------- */
function Footer() {
  const cols = [{
    h: 'Programs',
    items: ['AI', 'Cybersecurity', 'Method', 'Projects']
  }, {
    h: 'Lab',
    items: ['About', 'Mentors', 'Open source', 'Contact']
  }];
  return /*#__PURE__*/React.createElement("footer", {
    className: "als-footer",
    style: {
      background: ink.void,
      borderTop: `1px solid ${ink.line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "als-foot",
    style: {
      maxWidth: 1160,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Logo, {
    variant: "stacked",
    size: 30,
    style: {
      alignItems: 'flex-start'
    }
  })), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 11,
      letterSpacing: '.18em',
      textTransform: 'uppercase',
      color: ink.slate,
      marginBottom: 16
    }
  }, c.h), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 11
    }
  }, c.items.map(i => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    style: {
      fontFamily: "'Inter',sans-serif",
      fontSize: 14,
      color: ink.paper,
      textDecoration: 'none',
      opacity: 0.82
    }
  }, i)))))), /*#__PURE__*/React.createElement(GradientRule, {
    width: "100%",
    height: 2,
    style: {
      margin: '40px 0 22px',
      maxWidth: 1160,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1160,
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 12,
      color: ink.slate
    }
  }, "\xA9 2026 Architect Lab \u2014 by Morphaius & Bunkerity"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 12,
      color: ink.slate,
      letterSpacing: '.1em'
    }
  }, "DESIGN \xB7 BUILD \xB7 PROTECT")));
}

/* ---------------- App ---------------- */
function App() {
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: ink.void,
      minHeight: '100vh'
    }
  }, /*#__PURE__*/React.createElement("style", {
    dangerouslySetInnerHTML: {
      __html: RESPONSIVE_CSS
    }
  }), /*#__PURE__*/React.createElement(Nav, null), /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(Pillars, null), /*#__PURE__*/React.createElement(Tracks, null), /*#__PURE__*/React.createElement(Mentors, null), /*#__PURE__*/React.createElement(Join, null), /*#__PURE__*/React.createElement(Footer, null));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/site.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.GradientRule = __ds_scope.GradientRule;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.Switch = __ds_scope.Switch;

})();
