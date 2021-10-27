/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { getObjectsToMerge , expectedWarningOrthrow } = require( "./utils.js" );

describe( "non complient" , () => {
    it( "does crash when properties missmatch" , () => {
        expectedWarningOrthrow(

            // objs ----------------------------------------------
            getObjectsToMerge() ,

            // regexes -------------------------------------------
            [ />cool< is a property missing/ ] ,

            // options -------------------------------------------
            { complient : false }
        );
    } );
    it( "does crash when merging an object with itself" , () => {

        const obj = { hello : "world" };
        expectedWarningOrthrow(

            // objs ----------------------------------------------
            [ obj , obj ] ,

            // regexes -------------------------------------------
            [ /Cannot assign instance of type .* to itself/ ] ,

            // options -------------------------------------------
            { complient : false }
        );
    } );
} );