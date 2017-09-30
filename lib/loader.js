import utils from './parseUtils';

/**
 * Loader class responsible for hotloading Quasar components
 * so that is isn't necessary to import them or declare them
 * manually, and you still benefit from tree-shaking
 */
export default class QuasarLoader {

  /**
   * Primarily for testing individual functions -- normally
   * the content is passed in via the load() method
   */
  constructor ( content = '' ) {
    this.originalContent = content;
    this.transformedContent = content;

    if (content.length > 0) {
      this.initFormatting();
      this.validate();
    }
  }


  /**
   * Main function
   *
   * The webpack loader function
   * This is the only public method that should be used
   */

  load ( content ) {
    this.originalContent = content;
    this.transformedContent = content;

    if (!this.validate()) {
      return this.content;
    }

    if (!this.importIndentSpace) {
      this.initFormatting();
    }
    
    this.generateImportList();
    this.generateComponentList();

    return this.content;
  }

  /**
   * The resolved content in whatever state it's in
   *
   * If there have been any unrecoverable errors this will return the original file
   * untouched
   */

  get content () {
    return this.cancelTransforms === true
      ? this.originalContent
      : this.transformedContent;
  }

  /**
   * Import Statement Functions
   * i.e. import {
   *        QBtn,
   *        QField
   *      } from 'quasar';
   */// Section: Import Statement Functions

  /**
   * Generates an import statement with all quasar components
   * that were present in the template, modifying the existing import statement
   * if one exists 
   *
   * Mutates transformedContent
   */
  generateImportList () {
    this.quasarComponents = this.getComponentsFromTemplate();
    let componentString = this.quasarComponents
      .join(',\n  ' + this.importIndentSpace);

    let result = 'import {\n'
      + this.importIndentSpace
      + '  '
      + componentString
      + '\n'
      + this.importIndentSpace
      + '} from \'quasar\'';

    this.transformedContent = this.transformedContent.replace(
      utils.regExp.scriptStart, 
      '$1\n' 
        + this.importIndentSpace 
        + result
    );
  }


  /**
   * Removes existing quasar imports but
   * leaves anything imported from other sources intact
   */
  clearQuasarImports () {
    this.transformedContent = this.transformedContent.replace(utils.regExp.importStatement, '');
  }

  /**
   * Component Declaration Functions
   *
   * i.e. components: {
   *        QBtn,
   *        QField
   *     }
   */// Section: Component Declaration Functions
  

  /**
   * Returns an array all 
   * quasar components found in the view in PascalCase (i.e. QBtn) format
   * 
   * @return {Array<String>} The template components
   */
  getComponentsFromTemplate () {
    return this.template
      .match(utils.regExp.componentsFromTemplate)
      .map(match => {
        let resultString = '';
        let parts = match.split('-');

        return parts
          .map(p => {
            p = p.replace(utils.regExp.specialChars, '');
            return p[0].toUpperCase() + p.slice(1);
          })
          .join('');
      });
  }

  /**
   * Generates the components hash for the Vue instance
   * Overwrites Quasar components but leaves others intact
   */
  generateComponentList () {
    
    let componentsObj = []
      , match;
    
    while ((match = utils.regExp.componentDeclaration.exec(this.scriptBody)) !== null) {
      componentsObj.push(match);
    }

    if (componentsObj && componentsObj.length > 0) {
        let thirdPartyComponentJson = (
          componentsObj[0].length > 1 
            ? componentsObj[0][1] 
            : ''
          )
          .split(',')
          .filter(c => c[0] !== 'Q')
          .join(',');

      this.updateComponentList(thirdPartyComponentJson);

    } else {
      this.createComponentList(); 
    }
  }
  
  /**
   * Parses and updates an existing component hash
   * @param  {String} existingComponentsJson Non quasar components in JSON format
   * @example 
   * this.updateComponentList('{
   *   MyHeaderComponent: MyHeaderComponent,
   *   MyFooterComponent: MyFooterComponent
   * }');
   */
  updateComponentList ( existingComponentsJson ) {
    let componentsJson = 
      'components: {\n'
        + this.componentsIndentSpace + '  '
        + existingComponentsJson.trim()
        + ',\n'
        + this.componentsIndentSpace + '  '
        + this.quasarComponents.join(',\n' + this.componentsIndentSpace + '  ')
        + '\n'
        + this.componentsIndentSpace
        + '}';

    this.transformedContent = this.transformedContent.replace(utils.regExp.componentDeclaration, componentsJson + ',');
  }

  /**
   * Creates a new component hash
   * Should be used when one is not already present
   */
  createComponentList () {
    this.transformedContent = this.transformedContent.replace(
      utils.regExp.exportStatement,
      '$1\n' 
        + this.componentsIndentSpace 
        + 'components: {\n' 
        + this.componentsIndentSpace + '  ' 
        + this.quasarComponents.join(',\n' + this.componentsIndentSpace + '  ') 
        + '\n' 
        + this.componentsIndentSpace 
        + '},\n'
    );
  }

  /**
   * Starting point for indentation for import statement
   * Corresponds to the number of spaces the 'import 
   * @return {[type]} [description]
   */
  get importIndentSpace () {
    return ' '.repeat(this.importIndentLength);
  }

  /**
   * Spaces to indent components declaration
   * @return {String} Whitespace
   */
  get componentsIndentSpace () {
    return '  ' + this.importIndentSpace;
  }

  /**
   * Calculates various formatting parameters based on content
   */
  initFormatting () {

    let openScriptTag = this.content.match(utils.regExp.scriptStart);

    if (openScriptTag && openScriptTag[0]) {
      openScriptTag = openScriptTag[0];
    }
    this.importIndentLength = openScriptTag.length - openScriptTag.trim().length;
  }

  /**
   * Returns the html portion of the file
   * @return {String} html content
   */
  get template () {
    return this.originalContent
      .split('<template>')[1]
      .split('</template>')[0]
      .trim();
  }


  /**
   * Returns the script portion of the file
   * @return {String} script body content
   */
  get scriptBody () {
    return this.originalContent
      .split('<script>')[1]
      .split('</script>')[0];
  }

  /**
   * RegExps that must pass in order to successfully load
   * @return {Array<Boolean>} An array of success bools
   */
  get validators () {
    return [
      utils.regExp.scriptStart.test(this.originalContent),
      utils.regExp.exportStatement.test(this.scriptBody)
    ];
  }
  
  /**
   * Validates that we have all we need to load the file successfully
   * @return {Boolean} Whether or not the file is valid
   */
  validate () {
    
    if (
      this.validators
        .filter(v => v === false)
        .length > 0
    ) {
      this.cancelTransforms = true;
      return false;
    }

    return true;
  }
}