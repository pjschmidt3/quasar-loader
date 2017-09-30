export default {
  regExp: {
    importStatement: /import [a-zA-Z\{\}\s\,]+? from \'quasar\';?/gm,
    exportStatement: /(export default \{)/m,
    scriptStart: /\s*?\<script\>/m,
    componentsFromTemplate: /\<q\-[a-z]+[\s\>]/gm,
    componentDeclaration: /components\: \{([a-zA-Z0-9\:\,\s]*?)\}\,?/gm,
    specialChars: /[\<\>\\\-\,\_\@\:]/g
  }
};