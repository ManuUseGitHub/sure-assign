/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const { expectedWarningOrthrow , getObjectsToMerge } = require( "./utils.js" );

describe( "complient" , () => {
    test( "Only missing properties will not be part of the result" , () => {
        const result = expectedWarningOrthrow(

            // objs ----------------------------------------------
            getObjectsToMerge() ,

            // regexes -------------------------------------------
            [ />cool</ , />but</ ] ,

            // options -------------------------------------------
            void 0
        );
        expect( result.so ).toStrictEqual( "strict" );
    } );

    it( "does ignore the missed properties records when passmiss option is true" , () => {

        const objs = getObjectsToMerge();
        objs[ 2 ].missing = "this is missing";

        const result = expectedWarningOrthrow(

            // objs ----------------------------------------------
            objs ,

            // regexes -------------------------------------------
            [ />cool</ , />but</ , />missing</ ] ,

            // options -------------------------------------------
            { passmiss : true }
        );
        expect( result.so ).toBe( "cool" );
    } );

    it( "does not merge an obkject with itself" , () => {

        const obj = { hello : "word" };
        const result = expectedWarningOrthrow(

            // objs ----------------------------------------------
            [ obj , obj ] ,

            // regexes -------------------------------------------
            [ /Cannot assign instance of type .* to itself/ ] ,

            // options -------------------------------------------
            void 0
        );
        expect( result ).toStrictEqual( obj );
    } );
} );