/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { getObjectsToMerge , expectedWarningOrthrow } = require( "./utils.js" );

describe( "verbose" , () => {
    it( "does not crash neither prompt on error" , () => {
        obj = { Hello : "world" };
        objs1 = [ obj , obj ];
        objs2 = getObjectsToMerge();

        const options = { verbose : false };
        const cnslFuncs = [ "log" , "warn" , "error" , "info" ];

        expectedWarningOrthrow( objs1 , null , options , cnslFuncs );
        expectedWarningOrthrow( objs2 , null , options , cnslFuncs );
        expectedWarningOrthrow( objs2 , null , { verbose : false , passmiss : true  } , cnslFuncs );
    } );
} );