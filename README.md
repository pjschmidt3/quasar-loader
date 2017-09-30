# quasar-loader
A webpack loader that intelligently generates imports and component declarations for components that are discovered in the template markup

## Installation
```
npm install quasar-loader
```

## Usage
```
import QuasarLoader from 'quasar-loader';
const loader = new QuasarLoader();

// This is a typical webpack plugin function which accepts the file contents and returns them back after doing transforms
const load = loader.load;

let exampleContents = 
  `<template>
    <q-list>
      <q-item
        v-for="something in somewhere">
        <q-btn>
          Useless Button
       </q-btn>
      </q-item>
    </q-list>
  </template>
  
  <script>
    import something from 'whatever';
    
    export default {
      components: {
        SomeUnrelatedThirdPartyComponent
      }
    };
  </script>`;
const result = load(exampleContents);
console.log(result);

/*

<template>
  <q-list>
    <q-item
      v-for="something in somewhere">
      <q-btn>
        Useless Button
     </q-btn>
    </q-item>
  </q-list>
</template>
  
<script>
  import {
    QList,
    QItem,
    QBtn
  } from 'quasar';
  
  import something from 'whatever';

  export default {
    components: {
      SomeUnrelatedThirdPartyComponent,
      QList,
      QItem,
      QBtn
    }
  };
</script>

*/
```
