import server from "../../../services/server.js";
import utils from "../../../services/utils.js";
import appContext from "../../../components/app_context.js";
import OptionsWidget from "../../type_widgets/options/appearance/options_widget.js";

const FONT_FAMILIES = [
    { value: "theme", label: "Theme defined" },
    { value: "serif", label: "Serif" },
    { value: "sans-serif", label: "Sans Serif" },
    { value: "monospace", label: "Monospace" },
    { value: "Arial", label: "Arial" },
    { value: "Verdana", label: "Verdana" },
    { value: "Helvetica", label: "Helvetica" },
    { value: "Tahoma", label: "Tahoma" },
    { value: "Trebuchet MS", label: "Trebuchet MS" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Georgia", label: "Georgia" },
    { value: "Garamond", label: "Garamond" },
    { value: "Courier New", label: "Courier New" },
    { value: "Brush Script MT", label: "Brush Script MT" },
    { value: "Impact", label: "Impact" },
    { value: "American Typewriter", label: "American Typewriter" },
    { value: "Andalé Mono", label: "Andalé Mono" },
    { value: "Lucida Console", label: "Lucida Console" },
    { value: "Monaco", label: "Monaco" },
    { value: "Bradley Hand", label: "Bradley Hand" },
    { value: "Luminari", label: "Luminari" },
    { value: "Comic Sans MS", label: "Comic Sans MS" },
];

const TPL = `
<p><strong>Settings on this options tab are saved automatically after each change.</strong></p>

<style>
    .options-section .row {
        /* rows otherwise overflow horizontally and force a scrollbar */
        margin-left: auto;
        margin-right: auto;
    }
</style>

<div class="options-section">
    <div class="form-group row">
        <div class="col-6">
            <label for="zoom-factor-select">Zoom factor (desktop build only)</label>
    
            <input type="number" class="form-control" id="zoom-factor-select" min="0.3" max="2.0" step="0.1"/>
        </div>
        
        <div class="col-6">
            <label for="native-title-bar-select">Native title bar (requires app restart)</label>
    
            <select class="form-control" id="native-title-bar-select">
                <option value="show">enabled</option>
                <option value="hide">disabled</option>
            </select>
        </div>
    </div>
        
    <p>Zooming can be controlled with CTRL+- and CTRL+= shortcuts as well.</p>
</div>

<div class="options-section">
    <h4>Theme</h4>
    
    <div class="form-group row">
        <div class="col-6">
            <label for="theme-select">Theme</label>
            <select class="form-control" id="theme-select"></select>
        </div>
        
        <div class="col-6">
            <label for="override-theme-fonts">Override theme fonts</label>
            <input type="checkbox" class="form-control" id="override-theme-fonts">
        </div>
    </div>
<div class="options-section">

<div id="overriden-font-settings" class="options-section">
    <h4>Fonts</h4>
    
    <h5>Main font</h5>
    
    <div class="form-group row">
        <div class="col-6">
            <label for="main-font-family">Font family</label>
            <select class="form-control" id="main-font-family"></select>
        </div>
    
        <div class="col-6">
            <label for="main-font-size">Size</label>

            <div class="input-group">
                <input type="number" class="form-control" id="main-font-size" min="50" max="200" step="10"/>
                <div class="input-group-append">
                    <span class="input-group-text">%</span>
                </div>
            </div>
        </div>
    </div>

    <h5>Note tree font</h5>

    <div class="form-group row">
        <div class="col-4">
            <label for="tree-font-family">Font family</label>
            <select class="form-control" id="tree-font-family"></select>
        </div>
    
        <div class="col-4">
            <label for="tree-font-size">Size</label>

            <div class="input-group">
                <input type="number" class="form-control" id="tree-font-size" min="50" max="200" step="10"/>
                <div class="input-group-append">
                    <span class="input-group-text">%</span>
                </div>
            </div>
        </div>
    </div>
    
    <h5>Note detail font</h5>
    
    <div class="form-group row">
        <div class="col-4">
            <label for="detail-font-family">Font family</label>
            <select class="form-control" id="detail-font-family"></select>
        </div>
        
        <div class="col-4">
            <label for="detail-font-size">Size</label>

            <div class="input-group">
                <input type="number" class="form-control" id="detail-font-size" min="50" max="200" step="10"/>
                <div class="input-group-append">
                    <span class="input-group-text">%</span>
                </div>
            </div>
        </div>
    </div>
    
    <h5>Monospace (code) font</h5>
    
    <div class="form-group row">
        <div class="col-4">
            <label for="monospace-font-family">Font family</label>
            <select class="form-control" id="monospace-font-family"></select>
        </div>
    
        <div class="col-4">
            <label for="monospace-font-size">Size</label>

            <div class="input-group">
                <input type="number" class="form-control" id="monospace-font-size" min="50" max="200" step="10"/>
                <div class="input-group-append">
                    <span class="input-group-text">%</span>
                </div>
            </div>
        </div>
    </div>

    <p>Note that tree and detail font sizing is relative to the main font size setting.</p>

    <p>Not all listed fonts may be available on your system.</p>
</div>

<p>
    To apply font changes, click on 
    <button class="btn btn-micro reload-frontend-button">reload frontend</button>
</p>

<div class="options-section">
    <h4>Content width</h4>
    
    <p>Trilium by default limits max content width to improve readability for maximized screens on wide screens.</p>
    
    <div class="form-group row">
        <div class="col-4">
            <label for="max-content-width">Max content width in pixels</label>
            <input type="number" min="200" step="10" class="form-control" id="max-content-width">
        </div>
    </div>
    
    <p>
        To content width changes, click on 
        <button class="btn btn-micro reload-frontend-button">reload frontend</button>
    </p>
</div>
`;

export default class AppearanceOptions extends OptionsWidget {
    get tabTitle() { return "Appearance" }

    lazyRender() {
        this.$widget = $(TPL);

        this.$zoomFactorSelect = this.$widget.find("#zoom-factor-select");
        this.$nativeTitleBarSelect = this.$widget.find("#native-title-bar-select");

        this.$themeSelect = this.$widget.find("#theme-select");
        this.$overrideThemeFonts = this.$widget.find("#override-theme-fonts");

        this.$overridenFontSettings = this.$widget.find("#overriden-font-settings");

        this.$mainFontSize = this.$widget.find("#main-font-size");
        this.$mainFontFamily = this.$widget.find("#main-font-family");

        this.$treeFontSize = this.$widget.find("#tree-font-size");
        this.$treeFontFamily = this.$widget.find("#tree-font-family");

        this.$detailFontSize = this.$widget.find("#detail-font-size");
        this.$detailFontFamily = this.$widget.find("#detail-font-family");

        this.$monospaceFontSize = this.$widget.find("#monospace-font-size");
        this.$monospaceFontFamily = this.$widget.find("#monospace-font-family");

        this.$widget.find(".reload-frontend-button").on("click", () => utils.reloadFrontendApp("changes from appearance options"));

        this.$body = this.$widget.find("body");

        this.$themeSelect.on('change', async () => {
            const newTheme = this.$themeSelect.val();

            await server.put('options/theme/' + newTheme);

            utils.reloadFrontendApp("theme change");
        });

        this.$overrideThemeFonts.on('change', async () => {
            this.updateCheckboxOption('overrideThemeFonts', this.$overrideThemeFonts);

            this.$overridenFontSettings.toggle(this.$overrideThemeFonts.is(":checked"));
        });

        this.$zoomFactorSelect.on('change', () => { appContext.triggerCommand('setZoomFactorAndSave', {zoomFactor: this.$zoomFactorSelect.val()}); });

        this.$nativeTitleBarSelect.on('change', () => {
            const nativeTitleBarVisible = this.$nativeTitleBarSelect.val() === 'show' ? 'true' : 'false';

            this.updateOption('nativeTitleBarVisible', nativeTitleBarVisible);
        });

        const optionsToSave = [
            'mainFontFamily', 'mainFontSize',
            'treeFontFamily', 'treeFontSize',
            'detailFontFamily', 'detailFontSize',
            'monospaceFontFamily', 'monospaceFontSize'
        ];

        for (const optionName of optionsToSave) {
            this['$' + optionName].on('change', () =>
                this.updateOption(optionName, this['$' + optionName].val()));
        }

        this.$maxContentWidth = this.$widget.find("#max-content-width");

        this.$maxContentWidth.on('change', async () =>
            this.updateOption('maxContentWidth', this.$maxContentWidth.val()))
    }

    toggleBodyClass(prefix, value) {
        for (const clazz of Array.from(this.$body[0].classList)) { // create copy to safely iterate over while removing classes
            if (clazz.startsWith(prefix)) {
                this.$body.removeClass(clazz);
            }
        }

        this.$body.addClass(prefix + value);
    }

    async optionsLoaded(options) {
        if (utils.isElectron()) {
            this.$zoomFactorSelect.val(options.zoomFactor);
        }
        else {
            this.$zoomFactorSelect.prop('disabled', true);
        }

        this.$nativeTitleBarSelect.val(options.nativeTitleBarVisible === 'true' ? 'show' : 'hide');

        const themes = [
            { val: 'light', title: 'Light' },
            { val: 'dark', title: 'Dark' }
        ].concat(await server.get('options/user-themes'));

        this.$themeSelect.empty();

        for (const theme of themes) {
            this.$themeSelect.append($("<option>")
                .attr("value", theme.val)
                .attr("data-note-id", theme.noteId)
                .text(theme.title));
        }

        this.$themeSelect.val(options.theme);

        this.setCheckboxState(this.$overrideThemeFonts, options.overrideThemeFonts);
        this.$overridenFontSettings.toggle(options.overrideThemeFonts === 'true');

        this.$mainFontSize.val(options.mainFontSize);
        this.fillFontFamilyOptions(this.$mainFontFamily, options.mainFontFamily);

        this.$treeFontSize.val(options.treeFontSize);
        this.fillFontFamilyOptions(this.$treeFontFamily, options.treeFontFamily);

        this.$detailFontSize.val(options.detailFontSize);
        this.fillFontFamilyOptions(this.$detailFontFamily, options.detailFontFamily);

        this.$monospaceFontSize.val(options.monospaceFontSize);
        this.fillFontFamilyOptions(this.$monospaceFontFamily, options.monospaceFontFamily);

        this.$maxContentWidth.val(options.maxContentWidth);
    }

    fillFontFamilyOptions($select, currentValue) {
        $select.empty();

        for (const {value, label} of FONT_FAMILIES) {
            $select.append($("<option>")
                .attr("value", value)
                .prop("selected", value === currentValue)
                .text(label));
        }
    }
}
