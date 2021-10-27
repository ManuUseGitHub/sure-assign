# Sure ~ assign <br/>[![npm version](https://badge.fury.io/js/sure-assign.svg)](https://badge.fury.io/js/rehookt) [![Build Status](https://app.travis-ci.com/ManuUseGitHub/sure-assign.svg?branch=master)](https://app.travis-ci.com/ManuUseGitHub/sure-assign) [![License: MIT](https://img.shields.io/badge/License-MIT-61dafb.svg)](https://github.com/ManuUseGitHub/sure-assign/blob/master/LICENSE)

Does the same thing as `Object.assign` but ensure you to only assign existing properties/fields

## Getting started

1. Install the package into your <b>node</b> project.
    ```bash
    $ npm i sure-assign
    ```
2. Instenciate :
    You will use it as an object
    ```js
    const assigner = new ConsistentAssigner ();
    ```
3. Use it :
    ```js
    const obj_A = { ... }; // A is the base
    const obj_a = { ... }; // a is subset of A => OK
    const obj_Ɑ = { ... }; // alfa is superset of A => see complience (*)

    const result = assigner.assign(obj_A, obj_a, obj_Ɑ);
    console.log(result);
    
    // Outputed object
    // result : composition of content of theses 3 objects having this relation:
    // Ɑ <= a <= A
    ```
## Options
The options help you to generate the result object of your desire and more. 

**Note** : 
None of these is mandatory. It is just a way to tweak the outcomes and behaviors of the assigner

|option|type|default|note|
|-|-|-|-|
|verbose|boolean|true||
|complient|boolean|true||
|passmiss|boolean|false||
|secure|boolean|true||
|sort|string|"no"|no, asc or dsc|

1. **Complient**
    On false, the assigner will **`THROW`** exception to prevent you to make a bad assignement.
2. **Verbose**
    Once `false`, it prevents you to have warnings, when **`complient` is `true`**.
3. **Passmiss**
   Tells if you take the triggering objects of the assignment in count in the final result.
4. **Secure**
   If you set to `false`, the assigner do the same as the `Object.assign` funciton.
5. **Sort**
   Offers you the chance to sort the fields or properties of the result object in order **ASC**, **DSC** , or **NO**ne of these
