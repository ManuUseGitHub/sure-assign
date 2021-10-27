/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { sureAssignDefautOptions , ConsistentAssigner } = require( "../sure-assign/index" );

const assigner = new ConsistentAssigner();

const getObjectsToMerge = () => {
    return [
        { x : "x" , Hello : "word" , this_ : "is" , something : "that is" , so : "cool" } ,

        // this should not be applied
        { cool : "world" , but : "yet" , something : "yet" , so : "strict" } ,

        // this should
        { this_ : "strict" }
    ];
};

const expectedConsoleInteraction = ( cnslFunc , regexes , cb ) => {
    console[ cnslFunc ] = jest.fn();
    cb();
    regexes.forEach( regex => {
        expect( console[ cnslFunc ] )
            .toHaveBeenCalledWith( expect.stringMatching( regex ) );
    } );
};

const expectedNoConsoleInteraction = ( cnslFuncs , cb ) => {
    cb();
    cnslFuncs.forEach( cnslFunc => {
        console[ cnslFunc ] = jest.fn();
        expect( console[ cnslFunc ] )
            .toHaveBeenCalledTimes( 0 );
    } );
};

const expectedWarningOrthrow = ( objs , regexes , options = { complient : true } , consolesFuncts = [ "warn" ] ) => {
    const defaults = sureAssignDefautOptions;
    const {
        complient = defaults.complient ,
        verbose = defaults.verbose ,
        passmiss = defaults.passmiss ,
        unsure = defaults.unsure ,
        sort = defaults.sort ,
    } = options;
    
    const validOptions = { complient , verbose , passmiss , unsure , sort };

    let result = undefined;
    if ( complient ) {

        const cb = () => {
            result = assigner
                .with( validOptions )
                .assign( ...objs );
        };
        if( !validOptions.verbose  ){
            expectedNoConsoleInteraction ( consolesFuncts , cb );
        }
        else {
            expectedConsoleInteraction( "warn" , regexes , cb );
        }
    }
    else {
        expect( () => {
            assigner
                .with( validOptions )
                .assign( ...objs );
        } ).toThrow( expect.stringMatching( regexes[ 0 ] ) );
    }
    return result;
};

module.exports = { getObjectsToMerge , expectedConsoleInteraction , expectedWarningOrthrow };