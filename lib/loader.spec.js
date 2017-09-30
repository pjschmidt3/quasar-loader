import QuasarLoader from './loader';

const simpleContent =
  `<template>
    <q-field>
      <q-btn>

      </q-btn>
    </q-field>

    <div class="something">
    </div>
  </template>

  <script>

    import something from 'something-else';

    export default {
    };
  </script>`;

const contentWithOtherComponents = 
  `<template>
    <q-field>
      <q-btn>

      </q-btn>
    </q-field>

    <div class="something">
    </div>
  </template>

  <script>

    import something from 'something-else';

    export default {
      components: {
        something
      }
    };
  </script>`;

const invalidExportContent =
  `<template>
    <q-field>
      <q-btn>

      </q-btn>
    </q-field>

    <div class="something">
    </div>
  </template>

  <script>

    import something from 'something-else';

    export deflat {
      components: {
        something
      }
    };
  </script>`;

const invalidComponentsContent = 
  `<template>
    <q-field>
      <q-btn>

      </q-btn>
    </q-field>

    <div class="something">
    </div>
  </template>

  <script>

    import something from 'something-else';

    export default {
      compoonents: {
        something
      }
    };
  </script>`

describe('Quasar Loader', () => {

  describe('clearQuasarImports', () => {
    it('Should return the content string with quasar imports', () => {
      const loader = getLoader(simpleContent);

      loader.clearQuasarImports();
      loader.content.should.not.contain('from \'quasar\'');
    });
  });

  describe('generateImportList', () => {
    it('Should add a list of quasar imports to the content', () => {
      const loader = getLoader(simpleContent)

      loader.clearQuasarImports();
      loader.generateImportList();
      loader.content.should.contain('from \'quasar\'');
    });
  });

  describe('generateComponentList', () => {
    it('Should match imported components', () => {
      const loader = getLoader(simpleContent);
      loader.generateImportList();
      loader.generateComponentList();

      loader.content.replace(/\s/gm, '').should.contain('components:{QField,QBtn}')
    });

    it('Should keep existing component declarations intact', () => {
      
      const loader = getLoader(contentWithOtherComponents);

      loader.generateImportList();
      loader.generateComponentList();

      loader.content.replace(/\s/gm, '').should.contain('components:{something,QField,QBtn}');
    });
  });

  describe('Errors', () => {
    describe('Parse Errors', () => {

      it('Should return the original content unchanged', () => {
        const loader = getLoader(invalidExportContent);

        loader.generateImportList();
        loader.generateComponentList();

        loader.content.should.equal(invalidExportContent);
      });

      it('Should create a components object if one doesnt exist rather than throwing an error', () => {
        const loader = getLoader(invalidComponentsContent);

        loader.generateImportList();
        loader.generateComponentList();

        loader.content.should.not.equal(invalidComponentsContent);
      });
    })
  });

  describe('Load', () => {
    it('Should function the same as calling generateImportList and generateComponentList', () => {
      const loader = getLoader(simpleContent);

      loader.generateImportList();
      loader.generateComponentList();

      const otherLoader = getLoader();

      otherLoader.load(simpleContent);

      loader.content.should.equal(otherLoader.content);
    });

    it('Should work for loaders which were instantiated without content', () => {
      const loader = getLoader();
      loader.load(invalidExportContent);

      loader.content.should.equal(invalidExportContent)
    });
  });

  describe('Helpers', () => {
    describe('Template', () => {

      it('Should return an html template', () => {
        const loader = getLoader(simpleContent);

        var template = loader.template;


        template.should.contain('<q-field>')
      });
    });

    describe('scriptBody', () => {
      it('Should return a javascript string', () => {
        const loader = getLoader(simpleContent);

        loader.scriptBody.should.contain('import');
      });
    });

    describe('initFormatting', () => {
      const loader = getLoader(simpleContent);

      loader.initFormatting();

      loader.importIndentSpace.should.be.ok;
      loader.componentsIndentSpace.should.be.ok;
    });
  });
});

function getLoader ( content ) {
  return new QuasarLoader(content);
}