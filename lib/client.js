window.__ModuleLoader__.load({
  id: "dsh-settings-hub",
  factory: function (require) {
    var module = { exports: {} };
    var React = require("react");
    var STORAGE_KEY = "dsh-settings-hub:preferences:v1";
    var MAX_FAVORITES = 64;
    var MAX_ICON_ASSIGNMENTS = 128;
    var MAX_CUSTOM_TABS = 12;
    var MAX_TAB_ASSIGNMENTS = 128;
    var MAX_TAB_NAME_LENGTH = 32;
    var MAX_STORAGE_BYTES = 32 * 1024;
    var MAX_ID_LENGTH = 128;
    var MAX_LABEL_LENGTH = 160;
    var SELF_ID = "dsh-settings-hub";
    var ICONS = [
      { id: "grid", label: "网格" },
      { id: "sliders", label: "调节" },
      { id: "puzzle", label: "插件" },
      { id: "sparkles", label: "智能" },
      { id: "bot", label: "模型" },
      { id: "database", label: "数据" },
      { id: "shield", label: "安全" },
      { id: "palette", label: "外观" },
      { id: "bell", label: "通知" },
      { id: "search", label: "搜索" },
      { id: "folder", label: "文件" },
      { id: "terminal", label: "终端" },
      { id: "globe", label: "网络" },
      { id: "star", label: "收藏" },
    ];
    var ICON_NAMES = new Set(ICONS.map(function (icon) { return icon.id; }));
    var theme = {
      primary: "var(--dsw-alias-label-primary, CanvasText)",
      secondary: "var(--dsw-alias-label-secondary, CanvasText)",
      surface: "var(--dsw-alias-bg-layer-2, Canvas)",
      control: "var(--dsw-alias-bg-layer-1, Canvas)",
      border: "var(--dsw-alias-border-l2, ButtonBorder)",
      borderStrong: "var(--dsw-alias-border-l3, ButtonBorder)",
      accent: "var(--dsw-alias-state-business-primary, Highlight)",
      accentSurface: "var(--dsw-alias-state-business-tertiary, transparent)",
      onAccent: "var(--dsw-alias-label-primary-foreground, HighlightText)",
      danger: "var(--dsw-alias-state-error-primary, #d83931)",
    };

    var styles = {
      root: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxWidth: "920px",
        padding: "4px 2px 24px",
        color: theme.primary,
        colorScheme: "light dark",
        fontFamily: "inherit",
        fontSize: "14px",
        lineHeight: 1.5,
      },
      heading: { margin: 0, color: theme.primary, fontSize: "22px", fontWeight: 700, letterSpacing: "-0.01em", lineHeight: "30px" },
      headingRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" },
      intro: {
        margin: 0,
        color: theme.secondary,
        fontSize: "14px",
        lineHeight: "22px",
      },
      searchWrap: { display: "flex", flexDirection: "column", gap: "6px" },
      label: { color: theme.primary, fontSize: "13px", fontWeight: 600, lineHeight: "20px" },
      search: {
        width: "100%",
        boxSizing: "border-box",
        border: "1px solid " + theme.borderStrong,
        borderRadius: "10px",
        padding: "10px 12px",
        background: theme.control,
        color: theme.primary,
        font: "inherit",
        fontSize: "14px",
        lineHeight: "22px",
      },
      group: { display: "flex", flexDirection: "column", gap: "8px" },
      groupTitle: { display: "flex", alignItems: "center", gap: "7px", margin: 0, color: theme.primary, fontSize: "14px", fontWeight: 600, lineHeight: "22px" },
      grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
        gap: "8px",
      },
      card: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        minWidth: 0,
        border: "1px solid " + theme.border,
        borderRadius: "12px",
        padding: "11px",
        background: theme.surface,
        color: theme.primary,
      },
      iconBox: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 34px",
        width: "34px",
        height: "34px",
        borderRadius: "9px",
        background: theme.accentSurface,
        color: theme.accent,
      },
      cardText: { display: "flex", flex: "1 1 150px", minWidth: 0, flexDirection: "column", gap: "2px" },
      cardName: { overflow: "hidden", color: theme.primary, fontSize: "14px", fontWeight: 600, lineHeight: "20px", textOverflow: "ellipsis", whiteSpace: "nowrap" },
      cardMeta: { overflow: "hidden", color: theme.secondary, fontSize: "12px", lineHeight: "18px", textOverflow: "ellipsis", whiteSpace: "nowrap" },
      actions: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px", flexWrap: "wrap" },
      tabAssignSelect: {
        maxWidth: "132px",
        border: "1px solid " + theme.borderStrong,
        borderRadius: "8px",
        padding: "6px 7px",
        background: theme.control,
        color: theme.primary,
        font: "inherit",
        fontSize: "13px",
        lineHeight: "20px",
      },
      iconSelect: {
        maxWidth: "92px",
        border: "1px solid " + theme.borderStrong,
        borderRadius: "8px",
        padding: "6px 7px",
        background: theme.control,
        color: theme.primary,
        font: "inherit",
        fontSize: "13px",
        lineHeight: "20px",
      },
      button: {
        border: "1px solid " + theme.borderStrong,
        borderRadius: "8px",
        padding: "6px 10px",
        background: theme.control,
        color: theme.primary,
        cursor: "pointer",
        font: "inherit",
        fontSize: "13px",
        fontWeight: 500,
        lineHeight: "20px",
      },
      favorite: {
        width: "34px",
        height: "34px",
        border: "1px solid " + theme.borderStrong,
        borderRadius: "8px",
        background: theme.control,
        color: theme.primary,
        cursor: "pointer",
        font: "inherit",
        fontSize: "18px",
        lineHeight: 1,
      },
      primaryButton: {
        border: "1px solid " + theme.accent,
        borderRadius: "8px",
        padding: "6px 12px",
        background: theme.accent,
        color: theme.onAccent,
        cursor: "pointer",
        font: "inherit",
        fontSize: "13px",
        fontWeight: 600,
        lineHeight: "20px",
      },
      dangerButton: {
        border: "1px solid " + theme.danger,
        borderRadius: "8px",
        padding: "6px 10px",
        background: "transparent",
        color: theme.danger,
        cursor: "pointer",
        font: "inherit",
        fontSize: "12px",
        fontWeight: 600,
        lineHeight: "20px",
      },
      tabBar: { display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" },
      tabButton: {
        border: "1px solid " + theme.border,
        borderRadius: "999px",
        padding: "6px 11px",
        background: theme.control,
        color: theme.secondary,
        cursor: "pointer",
        font: "inherit",
        fontSize: "13px",
        fontWeight: 500,
        lineHeight: "20px",
      },
      tabButtonActive: { borderColor: theme.accent, background: theme.accentSurface, color: theme.primary, fontWeight: 600 },
      editPanel: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        border: "1px solid " + theme.border,
        borderRadius: "12px",
        padding: "14px",
        background: theme.surface,
      },
      editorTitle: { margin: 0, color: theme.primary, fontSize: "14px", fontWeight: 600, lineHeight: "22px" },
      editorHint: { margin: 0, color: theme.secondary, fontSize: "12px", lineHeight: "18px" },
      newTabRow: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
      textInput: {
        flex: "1 1 220px",
        minWidth: 0,
        border: "1px solid " + theme.borderStrong,
        borderRadius: "8px",
        padding: "7px 9px",
        background: theme.control,
        color: theme.primary,
        font: "inherit",
        fontSize: "13px",
        lineHeight: "20px",
      },
      tabEditorList: { display: "flex", flexDirection: "column", gap: "8px" },
      tabEditorRow: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
      empty: {
        border: "1px dashed " + theme.borderStrong,
        borderRadius: "10px",
        padding: "18px",
        color: theme.secondary,
        fontSize: "14px",
        textAlign: "center",
      },
      status: { minHeight: "18px", margin: 0, color: theme.secondary, fontSize: "12px", lineHeight: "18px" },
      boundary: {
        borderLeft: "3px solid " + theme.accent,
        paddingLeft: "10px",
        color: theme.secondary,
        fontSize: "12px",
        lineHeight: "18px",
      },
    };

    function boundedText(value, limit) {
      return String(value == null ? "" : value).replace(/\s+/g, " ").trim().slice(0, limit);
    }

    function iconShapes(name) {
      function path(key, d) { return React.createElement("path", { key: key, d: d }); }
      function circle(key, cx, cy, r) { return React.createElement("circle", { key: key, cx: cx, cy: cy, r: r }); }
      function rect(key, x, y, width, height, rx) { return React.createElement("rect", { key: key, x: x, y: y, width: width, height: height, rx: rx }); }
      function line(key, x1, y1, x2, y2) { return React.createElement("line", { key: key, x1: x1, y1: y1, x2: x2, y2: y2 }); }
      switch (name) {
        case "sliders": return [line("a", 4, 7, 20, 7), circle("b", 9, 7, 2), line("c", 4, 17, 20, 17), circle("d", 15, 17, 2)];
        case "puzzle": return [path("a", "M9 4h3a2 2 0 1 1 4 0h4v5a2 2 0 1 0 0 4v7h-7a2 2 0 1 0-4 0H4v-7a2 2 0 1 0 0-4V4h5Z")];
        case "sparkles": return [path("a", "m12 3 1.2 3.3L16.5 7.5l-3.3 1.2L12 12l-1.2-3.3-3.3-1.2 3.3-1.2L12 3Z"), path("b", "m18 13 .8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8L18 13Z"), path("c", "m6 14 1 2.8 2.8 1L7 18.8 6 22l-1-3.2-3-1 3-1L6 14Z")];
        case "bot": return [rect("a", 4, 7, 16, 12, 3), line("b", 12, 3, 12, 7), circle("c", 12, 3, 1), circle("d", 9, 13, 1), circle("e", 15, 13, 1), path("f", "M9 16h6")];
        case "database": return [path("a", "M4 6c0-2 3.6-3 8-3s8 1 8 3-3.6 3-8 3-8-1-8-3Z"), path("b", "M4 6v6c0 2 3.6 3 8 3s8-1 8-3V6"), path("c", "M4 12v6c0 2 3.6 3 8 3s8-1 8-3v-6")];
        case "shield": return [path("a", "M12 3 4.5 6v5.5c0 4.6 3.1 8 7.5 9.5 4.4-1.5 7.5-4.9 7.5-9.5V6L12 3Z"), path("b", "m8.5 12 2.2 2.2 4.8-5")];
        case "palette": return [path("a", "M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h3.5A5.5 5.5 0 0 0 21 7.5C21 5 17 3 12 3Z"), circle("b", 7.5, 9, 1), circle("c", 10.5, 6.5, 1), circle("d", 15, 7, 1)];
        case "bell": return [path("a", "M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"), path("b", "M10 21h4")];
        case "search": return [circle("a", 10.5, 10.5, 6.5), line("b", 15.5, 15.5, 21, 21)];
        case "folder": return [path("a", "M3 6.5A2.5 2.5 0 0 1 5.5 4H10l2 2h6.5A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-10Z")];
        case "terminal": return [rect("a", 3, 4, 18, 16, 2), path("b", "m7 9 3 3-3 3"), line("c", 13, 15, 17, 15)];
        case "globe": return [circle("a", 12, 12, 9), path("b", "M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18")];
        case "star": return [path("a", "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z")];
        default: return [rect("a", 4, 4, 6, 6, 1), rect("b", 14, 4, 6, 6, 1), rect("c", 4, 14, 6, 6, 1), rect("d", 14, 14, 6, 6, 1)];
      }
    }

    function renderLineIcon(name, size) {
      var safeName = ICON_NAMES.has(name) ? name : "grid";
      return React.createElement("svg", {
        width: size || 18,
        height: size || 18,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": "true",
        focusable: "false",
        "data-icon": safeName,
      }, iconShapes(safeName));
    }

    function resolveLabel(entry) {
      var label = entry && entry.options ? entry.options.label : undefined;
      try {
        return boundedText(typeof label === "function" ? label() : label, MAX_LABEL_LENGTH);
      } catch (_) {
        return "";
      }
    }

    function activeEntries(slots, key) {
      if (typeof slots.entriesOfSlot === "function") return slots.entriesOfSlot(key);
      return slots.entries(key);
    }

    function collectItems(slots, key, kind) {
      var seen = new Set();
      return Array.from(activeEntries(slots, key) || []).flatMap(function (entry) {
        var id = boundedText(entry && entry.options && entry.options.id, MAX_ID_LENGTH);
        if (!id || (kind === "section" && id === SELF_ID) || seen.has(id)) return [];
        seen.add(id);
        var label = resolveLabel(entry) || id;
        return [{
          key: kind + ":" + id,
          kind: kind,
          id: id,
          label: label,
          order: Number.isFinite(entry.options && entry.options.order) ? entry.options.order : 1000,
          registrant: boundedText(entry && entry.registrant, MAX_LABEL_LENGTH),
        }];
      }).sort(function (left, right) {
        return left.order - right.order || left.label.localeCompare(right.label, "zh-CN") || left.id.localeCompare(right.id);
      });
    }

    function validEntryKey(value) {
      return typeof value === "string" && value.length > 0 && value.length <= MAX_ID_LENGTH + 16 && /^(section|plugin-tab):[^\s]+$/.test(value);
    }

    function validTabId(value) {
      return typeof value === "string" && /^tab-[1-9]\d{0,3}$/.test(value);
    }

    function emptyPreferences() {
      return { favorites: [], icons: {}, tabs: [], assignments: {} };
    }

    function normalizePreferences(value) {
      if (!value || typeof value !== "object" || Array.isArray(value)) return emptyPreferences();
      var favoriteSource = Array.isArray(value.favorites) ? value.favorites : [];
      var favorites = Array.from(new Set(favoriteSource.filter(validEntryKey))).slice(0, MAX_FAVORITES);
      var icons = {};
      if (value.icons && typeof value.icons === "object" && !Array.isArray(value.icons)) {
        Object.entries(value.icons).slice(0, MAX_ICON_ASSIGNMENTS * 2).forEach(function (pair) {
          if (Object.keys(icons).length >= MAX_ICON_ASSIGNMENTS) return;
          if (validEntryKey(pair[0]) && ICON_NAMES.has(pair[1])) icons[pair[0]] = pair[1];
        });
      }
      var tabs = [];
      var seenTabIds = new Set();
      if (Array.isArray(value.tabs)) {
        value.tabs.slice(0, MAX_CUSTOM_TABS * 2).forEach(function (tab) {
          if (tabs.length >= MAX_CUSTOM_TABS || !tab || typeof tab !== "object") return;
          var id = tab.id;
          var label = boundedText(tab.label, MAX_TAB_NAME_LENGTH);
          if (!validTabId(id) || !label || seenTabIds.has(id)) return;
          seenTabIds.add(id);
          tabs.push({ id: id, label: label });
        });
      }
      var assignments = {};
      if (value.assignments && typeof value.assignments === "object" && !Array.isArray(value.assignments)) {
        Object.entries(value.assignments).slice(0, MAX_TAB_ASSIGNMENTS * 2).forEach(function (pair) {
          if (Object.keys(assignments).length >= MAX_TAB_ASSIGNMENTS) return;
          if (validEntryKey(pair[0]) && seenTabIds.has(pair[1])) assignments[pair[0]] = pair[1];
        });
      }
      return { favorites: favorites, icons: icons, tabs: tabs, assignments: assignments };
    }

    function clonePreferences(value) {
      return {
        favorites: value.favorites.slice(0, MAX_FAVORITES),
        icons: Object.assign({}, value.icons),
        tabs: value.tabs.map(function (tab) { return { id: tab.id, label: tab.label }; }),
        assignments: Object.assign({}, value.assignments),
      };
    }

    function nextTabId(tabs) {
      var ids = new Set(tabs.map(function (tab) { return tab.id; }));
      for (var index = 1; index <= 9999; index += 1) {
        var candidate = "tab-" + index;
        if (!ids.has(candidate)) return candidate;
      }
      return "";
    }

    function readPreferences() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY) || "";
        if (!raw || raw.length > MAX_STORAGE_BYTES) return emptyPreferences();
        var value = JSON.parse(raw);
        return normalizePreferences(value);
      } catch (_) {
        return emptyPreferences();
      }
    }

    function writePreferences(value) {
      try {
        var encoded = JSON.stringify(normalizePreferences(value));
        if (encoded.length > MAX_STORAGE_BYTES) return false;
        localStorage.setItem(STORAGE_KEY, encoded);
        return true;
      } catch (_) {
        return false;
      }
    }

    function useSlotItems(ctx, key, kind) {
      var subscribe = React.useCallback(function (notify) {
        return ctx.slots.subscribe(key, notify);
      }, [ctx, key]);
      var snapshot = React.useCallback(function () {
        return ctx.slots.getVersion(key);
      }, [ctx, key]);
      var version = React.useSyncExternalStore(subscribe, snapshot, snapshot);
      return React.useMemo(function () {
        return collectItems(ctx.slots, key, kind);
      }, [ctx, key, kind, version]);
    }

    function groupFor(item) {
      if (item.kind === "plugin-tab") return "插件页面";
      if (item.id === "general") return "基础设置";
      if (/model|account/i.test(item.id)) return "模型与账号";
      if (item.id === "plugins") return "插件";
      if (/agent|automation|workflow/i.test(item.id)) return "Agent 与自动化";
      return "扩展设置";
    }

    function defaultIconFor(item) {
      if (item.kind === "plugin-tab" || /plugin|extension/i.test(item.id)) return "puzzle";
      if (/security|privacy|permission|safe/i.test(item.id)) return "shield";
      if (/model|account|provider/i.test(item.id)) return "bot";
      if (/agent|automation|workflow|ai/i.test(item.id)) return "sparkles";
      if (/appearance|theme|display/i.test(item.id)) return "palette";
      if (/notification|message|alert/i.test(item.id)) return "bell";
      if (/data|storage|database|memory/i.test(item.id)) return "database";
      if (/file|folder|workspace|project/i.test(item.id)) return "folder";
      if (/terminal|developer|debug|command/i.test(item.id)) return "terminal";
      if (/network|browser|web|proxy/i.test(item.id)) return "globe";
      if (/search|find/i.test(item.id)) return "search";
      if (/general|setting|preference/i.test(item.id)) return "sliders";
      return "grid";
    }

    function groupIcon(group) {
      if (group === "收藏") return "star";
      if (group === "基础设置") return "sliders";
      if (group === "模型与账号") return "bot";
      if (group === "插件" || group === "插件页面") return "puzzle";
      if (group === "Agent 与自动化") return "sparkles";
      return "grid";
    }

    function clickExact(root, selector, label) {
      if (!root) return false;
      var target = Array.from(root.querySelectorAll(selector)).find(function (element) {
        return boundedText(element.textContent, MAX_LABEL_LENGTH) === label;
      });
      if (!target || typeof target.click !== "function") return false;
      target.click();
      return true;
    }

    function createSettingsHub(ctx) {
      return function SettingsHub() {
        var sections = useSlotItems(ctx, "settings.section", "section");
        var pluginTabs = useSlotItems(ctx, "settings.plugins.tab", "plugin-tab");
        var queryState = React.useState("");
        var query = queryState[0];
        var setQuery = queryState[1];
        var preferencesState = React.useState(readPreferences);
        var preferences = preferencesState[0];
        var setPreferences = preferencesState[1];
        var draftState = React.useState(null);
        var draft = draftState[0];
        var setDraft = draftState[1];
        var newTabNameState = React.useState("");
        var newTabName = newTabNameState[0];
        var setNewTabName = newTabNameState[1];
        var activeTabState = React.useState("all");
        var activeTab = activeTabState[0];
        var setActiveTab = activeTabState[1];
        var statusState = React.useState("");
        var status = statusState[0];
        var setStatus = statusState[1];
        var editing = draft !== null;
        var working = editing ? draft : preferences;
        var favorites = new Set(working.favorites);
        var normalizedQuery = boundedText(query, 80).toLocaleLowerCase("zh-CN");
        var allItems = React.useMemo(function () {
          return sections.concat(pluginTabs);
        }, [sections, pluginTabs]);
        var searchedItems = allItems.filter(function (item) {
          if (!normalizedQuery) return true;
          return [item.label, item.id, item.registrant].join(" ").toLocaleLowerCase("zh-CN").includes(normalizedQuery);
        });
        var activeCustomTab = working.tabs.find(function (tab) { return tab.id === activeTab; });
        var visible = searchedItems.filter(function (item) {
          if (editing || activeTab === "all") return true;
          if (activeTab === "favorites") return favorites.has(item.key);
          return activeCustomTab ? working.assignments[item.key] === activeCustomTab.id : true;
        });
        var groups = new Map();
        if (!editing && activeTab === "favorites") groups.set("收藏", visible);
        else if (!editing && activeCustomTab) groups.set(activeCustomTab.label, visible);
        else {
          visible.forEach(function (item) {
            var group = groupFor(item);
            if (!groups.has(group)) groups.set(group, []);
            groups.get(group).push(item);
          });
        }

        function updateDraft(updater) {
          setDraft(function (current) {
            if (!current) return current;
            return updater(clonePreferences(current));
          });
        }

        function beginEditing() {
          setDraft(clonePreferences(preferences));
          setNewTabName("");
          setActiveTab("all");
          setStatus("编辑中：修改图标与 Tab 后点击“保存”。");
        }

        function cancelEditing() {
          setDraft(null);
          setNewTabName("");
          setStatus("已取消本次布局修改。");
        }

        function saveEditing() {
          if (!draft) return;
          var next = normalizePreferences(draft);
          if (!writePreferences(next)) {
            setStatus("保存失败：当前浏览器拒绝写入本地配置；草稿仍保留，可重试或取消。");
            return;
          }
          setPreferences(next);
          setDraft(null);
          setNewTabName("");
          if (activeTab !== "all" && activeTab !== "favorites" && !next.tabs.some(function (tab) { return tab.id === activeTab; })) setActiveTab("all");
          setStatus("布局已保存到当前浏览器。");
        }

        function toggleFavorite(item) {
          updateDraft(function (current) {
            var nextFavorites = new Set(current.favorites);
            if (nextFavorites.has(item.key)) nextFavorites.delete(item.key);
            else if (nextFavorites.size < MAX_FAVORITES) nextFavorites.add(item.key);
            current.favorites = Array.from(nextFavorites);
            return current;
          });
        }

        function setItemIcon(item, icon) {
          updateDraft(function (current) {
            if (!icon) delete current.icons[item.key];
            else if (ICON_NAMES.has(icon) && (Object.prototype.hasOwnProperty.call(current.icons, item.key) || Object.keys(current.icons).length < MAX_ICON_ASSIGNMENTS)) current.icons[item.key] = icon;
            return current;
          });
        }

        function assignItemToTab(item, tabId) {
          updateDraft(function (current) {
            if (!tabId) delete current.assignments[item.key];
            else if (current.tabs.some(function (tab) { return tab.id === tabId; }) && (Object.prototype.hasOwnProperty.call(current.assignments, item.key) || Object.keys(current.assignments).length < MAX_TAB_ASSIGNMENTS)) current.assignments[item.key] = tabId;
            return current;
          });
        }

        function addCustomTab() {
          var label = boundedText(newTabName, MAX_TAB_NAME_LENGTH);
          if (!label) {
            setStatus("请输入 Tab 名称。");
            return;
          }
          if (!draft || draft.tabs.length >= MAX_CUSTOM_TABS) {
            setStatus("自定义 Tab 最多 " + MAX_CUSTOM_TABS + " 个。");
            return;
          }
          var id = nextTabId(draft.tabs);
          if (!id) {
            setStatus("无法生成新的 Tab ID。");
            return;
          }
          updateDraft(function (current) {
            current.tabs.push({ id: id, label: label });
            return current;
          });
          setNewTabName("");
          setStatus("已添加“" + label + "”；保存后生效。");
        }

        function renameCustomTab(tabId, label) {
          updateDraft(function (current) {
            var tab = current.tabs.find(function (candidate) { return candidate.id === tabId; });
            if (tab) tab.label = boundedText(label, MAX_TAB_NAME_LENGTH);
            return current;
          });
        }

        function removeCustomTab(tabId) {
          updateDraft(function (current) {
            current.tabs = current.tabs.filter(function (tab) { return tab.id !== tabId; });
            Object.keys(current.assignments).forEach(function (key) {
              if (current.assignments[key] === tabId) delete current.assignments[key];
            });
            return current;
          });
          setStatus("Tab 已从草稿移除；其项目会回到默认分组，保存后生效。");
        }

        function openItem(item) {
          var dialog = document.querySelector('[role="dialog"][aria-modal="true"]');
          if (!dialog) {
            setStatus("未找到当前设置对话框；请从官方设置入口重试。");
            return;
          }
          if (item.kind === "section") {
            if (!clickExact(dialog, "nav button", item.label)) setStatus("当前官方导航中没有可打开的“" + item.label + "”。");
            return;
          }
          var pluginsSection = sections.find(function (entry) { return entry.id === "plugins"; });
          if (!pluginsSection || !clickExact(dialog, "nav button", pluginsSection.label)) {
            setStatus("当前官方导航中没有可打开的插件设置页。");
            return;
          }
          setTimeout(function () {
            var currentDialog = document.querySelector('[role="dialog"][aria-modal="true"]');
            if (!clickExact(currentDialog, '[role="tab"], button', item.label)) setStatus("插件页已打开，但没有找到“" + item.label + "”标签。");
          }, 0);
        }

        function renderCard(item) {
          var favorite = favorites.has(item.key);
          var selectedIcon = working.icons[item.key] || "";
          var assignedTab = working.assignments[item.key] || "";
          var displayIcon = selectedIcon || defaultIconFor(item);
          return React.createElement("div", { key: item.key, style: styles.card, role: "listitem" },
            React.createElement("span", { style: styles.iconBox, title: (selectedIcon ? "已配置：" : "自动推荐：") + displayIcon }, renderLineIcon(displayIcon, 19)),
            React.createElement("div", { style: styles.cardText },
              React.createElement("span", { style: styles.cardName }, item.label),
              React.createElement("span", { style: styles.cardMeta }, (item.kind === "plugin-tab" ? "插件页面" : "设置页面") + " · " + item.id)),
            React.createElement("div", { style: styles.actions },
              editing ? React.createElement("select", {
                value: selectedIcon,
                style: styles.iconSelect,
                onChange: function (event) { setItemIcon(item, event.target.value); },
                "aria-label": "设置 " + item.label + " 图标",
                title: "选择线性图标",
              },
              React.createElement("option", { value: "" }, "图标：自动"),
              ICONS.map(function (icon) { return React.createElement("option", { key: icon.id, value: icon.id }, "图标：" + icon.label); })) : null,
              editing ? React.createElement("select", {
                value: assignedTab,
                style: styles.tabAssignSelect,
                onChange: function (event) { assignItemToTab(item, event.target.value); },
                "aria-label": "设置 " + item.label + " 所属 Tab",
                title: "加入自定义 Tab 或移回默认分组",
              },
              React.createElement("option", { value: "" }, "Tab：默认分组"),
              working.tabs.map(function (tab) { return React.createElement("option", { key: tab.id, value: tab.id }, "Tab：" + (tab.label || "未命名")); })) : null,
              editing ? React.createElement("button", {
                type: "button",
                style: styles.favorite,
                onClick: function () { toggleFavorite(item); },
                "aria-label": (favorite ? "取消收藏 " : "收藏 ") + item.label,
                title: favorite ? "取消收藏" : "收藏",
              }, favorite ? "★" : "☆") : null,
              React.createElement("button", {
                type: "button",
                style: styles.button,
                onClick: function () { openItem(item); },
                "aria-label": "打开 " + item.label,
              }, "打开")));
        }

        function renderTabButton(id, label) {
          var selected = !editing && activeTab === id;
          return React.createElement("button", {
            key: id,
            type: "button",
            role: "tab",
            "aria-selected": selected,
            style: selected ? Object.assign({}, styles.tabButton, styles.tabButtonActive) : styles.tabButton,
            onClick: function () { setActiveTab(id); },
          }, label);
        }

        function renderEditor() {
          if (!editing) return null;
          return React.createElement("section", { style: styles.editPanel, "aria-labelledby": "dsh-settings-hub-editor-title" },
            React.createElement("h3", { id: "dsh-settings-hub-editor-title", style: styles.editorTitle }, "编辑自定义 Tab"),
            React.createElement("p", { style: styles.editorHint }, "新建 Tab 后，在下方每个项目的“Tab”下拉框中加入或移回默认分组；所有修改只在点击保存后写入当前浏览器。"),
            React.createElement("div", { style: styles.newTabRow },
              React.createElement("input", {
                type: "text",
                value: newTabName,
                maxLength: MAX_TAB_NAME_LENGTH,
                placeholder: "例如：常用插件",
                style: styles.textInput,
                onChange: function (event) { setNewTabName(event.target.value.slice(0, MAX_TAB_NAME_LENGTH)); },
                onKeyDown: function (event) { if (event.key === "Enter") addCustomTab(); },
                "aria-label": "新 Tab 名称",
              }),
              React.createElement("button", { type: "button", style: styles.button, onClick: addCustomTab }, "添加 Tab")),
            working.tabs.length
              ? React.createElement("div", { style: styles.tabEditorList }, working.tabs.map(function (tab) {
                return React.createElement("div", { key: tab.id, style: styles.tabEditorRow },
                  React.createElement("input", {
                    type: "text",
                    value: tab.label,
                    maxLength: MAX_TAB_NAME_LENGTH,
                    style: styles.textInput,
                    onChange: function (event) { renameCustomTab(tab.id, event.target.value); },
                    "aria-label": "重命名 Tab " + (tab.label || tab.id),
                  }),
                  React.createElement("button", {
                    type: "button",
                    style: styles.dangerButton,
                    onClick: function () { removeCustomTab(tab.id); },
                    "aria-label": "删除 Tab " + (tab.label || tab.id),
                  }, "删除"));
              }))
              : React.createElement("p", { style: styles.editorHint }, "还没有自定义 Tab。"));
        }

        return React.createElement("section", { style: styles.root, "aria-labelledby": "dsh-settings-hub-title" },
          React.createElement("div", { style: styles.headingRow },
            React.createElement("h2", { id: "dsh-settings-hub-title", style: styles.heading }, "设置导航中心"),
            React.createElement("div", { style: styles.actions },
              editing ? React.createElement("button", { type: "button", style: styles.button, onClick: cancelEditing }, "取消") : null,
              editing ? React.createElement("button", { type: "button", style: styles.primaryButton, onClick: saveEditing }, "保存")
                : React.createElement("button", { type: "button", style: styles.primaryButton, onClick: beginEditing }, "编辑布局"))),
          React.createElement("p", { style: styles.intro }, "搜索并打开 DSH 当前注册的设置页面；通过“编辑布局”配置图标、收藏和自定义 Tab。"),
          renderEditor(),
          !editing ? React.createElement("div", { style: styles.tabBar, role: "tablist", "aria-label": "导航中心视图" },
            renderTabButton("all", "全部"),
            renderTabButton("favorites", "收藏"),
            working.tabs.map(function (tab) { return renderTabButton(tab.id, tab.label); })) : null,
          React.createElement("div", { style: styles.searchWrap, role: "search" },
            React.createElement("label", { htmlFor: "dsh-settings-hub-search", style: styles.label }, "搜索设置"),
            React.createElement("input", {
              id: "dsh-settings-hub-search",
              type: "search",
              value: query,
              maxLength: 80,
              placeholder: "输入页面名称或 ID",
              style: styles.search,
              onChange: function (event) { setQuery(event.target.value.slice(0, 80)); },
            })),
          visible.length === 0
            ? React.createElement("div", { style: styles.empty }, normalizedQuery ? "没有匹配的设置页面。" : (!editing && activeTab !== "all" ? "当前 Tab 还没有项目；可在“编辑布局”中添加。" : "当前没有可索引的设置页面。"))
            : Array.from(groups.entries()).map(function (pair, index) {
              var headingId = "dsh-settings-hub-group-" + index;
              return React.createElement("section", { key: pair[0], style: styles.group, "aria-labelledby": headingId },
                React.createElement("h3", { id: headingId, style: styles.groupTitle }, renderLineIcon(groupIcon(pair[0]), 16), pair[0]),
                React.createElement("div", { style: styles.grid, role: "list" }, pair[1].map(renderCard)));
            }),
          React.createElement("p", { style: styles.status, role: "status", "aria-live": "polite" }, status),
          React.createElement("div", { style: styles.boundary }, "安全边界：自定义 Tab、收藏与图标只整理 Settings Hub 自己的视图并保存在浏览器 localStorage；不会增删、移动或覆盖 DSH 官方侧边栏，官方入口始终保留。"));
      };
    }

    function apply(ctx) {
      ctx.slots.inject("settings.section", function () {
        return ctx.slots.register({
          name: "settings.section",
          id: SELF_ID,
          order: 145,
          label: function () { return "设置中心"; },
        }, createSettingsHub(ctx));
      });
    }

    module.exports.apply = apply;
    module.exports.inject = ["slots"];
    return module.exports;
  },
});
