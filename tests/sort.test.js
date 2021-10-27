/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { getObjectsToMerge , expectedWarningOrthrow } = require( "./utils.js" );

describe( "sort" , () => {
    const toCompare = [ "Hello" , "this_" , "something" , "so" , "x" ];
    it( "does sort in asc order" , () => {
        const result = expectedWarningOrthrow(

            // objs ----------------------------------------------
            getObjectsToMerge() ,

            // regexes -------------------------------------------
            [ />cool</ , />but</ ] ,

            // options -------------------------------------------
            { sort : "asc" }
        );
        expect( result.so ).toStrictEqual( "strict" );
        const compare = toCompare.sort( ( a , b ) => a>b ? 1 : -1 );

        Object.keys( result ).forEach( ( key , i ) => {
            expect( key ).toBe( compare[ i ] );
        } );
    } );

    it( "does sort in dsc order" , () => {
        const result = expectedWarningOrthrow(

            // objs ----------------------------------------------
            getObjectsToMerge() ,

            // regexes -------------------------------------------
            [ />cool</ , />but</ ] ,

            // options -------------------------------------------
            { sort : "dsc" }
        );
        expect( result.so ).toStrictEqual( "strict" );
        const compare = toCompare.sort( ( a , b ) => a>b ? -1 : 1 );

        Object.keys( result ).forEach( ( key , i ) => {
            expect( key ).toBe( compare[ i ] );
        } );
    } );
} );