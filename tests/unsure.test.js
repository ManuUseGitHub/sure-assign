/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { getObjectsToMerge , expectedWarningOrthrow } = require( "./utils.js" );

describe( "unsure" , () => {
    it( "Does accept mismatching" , () => {
        
        const objs = [ { a : "a" } , null , { c : "c" } , { b : "b" } ];
        const options = { unsure : true };
        
        const result = expectedWarningOrthrow( objs , [ /These fields .* will been assigned/ ] , options );
        expect( Object.keys( result ). length ).toBe ( 3  );
    } );
} );