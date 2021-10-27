import { ErrorHandler } from "./error-handling";
import { ISureAssignOptions } from "./interfaces";

// OPTIONS with defaults values set ----------
const __defaults: ISureAssignOptions = {
	complient : true , // isComplient
	verbose : true , // prompt something if complient
	passmiss : false , // pass on missing
	sort : "no" , // sort the resulting 1st level properties
	unsure : false , // tells if we desire to do the exact same as Object.assign
};

class ConsistentAssigner {
	errorHandler: ErrorHandler;
	options: any = {};

	constructor() {
		this.initOptions();
		this.errorHandler = new ErrorHandler( this );
	}

	assign( instance: any , ...candidates: any[] ) {

		// working on a copy
		let result = Object.assign( {} , instance );

		// looping through all candidates list or given objects
		candidates.forEach( ( json ) => {

			// polpulate the checks if complient or throw if not
			const checks = this.errorHandler.validateAssignement( instance , json );

			const { complient , passmiss } = this.options;
			const encouteredAMissing = checks.reasons.includes( "missing property" );

			// conditions to be complient on missing props :
			const complientOnMissing =

				// - we already have a missing property,
				encouteredAMissing &&
				
				// - we dont pass the missed 
				// - and we are complient
				complient && !passmiss;

			// if we want to assign even if we have missmatchings
			const unsure = this.options.unsure;

			// if nothing bad happened or if we accept missing properties
			if ( !checks.reasons.length || complientOnMissing || unsure ) {
				result = Object.assign( result , json );
			}
		} );

		return this.sort( result );
	}

	sort( result: any ) {
		let sorted = result;

		const regularSort = ( a: any , b: any ) => ( a < b ? -1 : 1 );
		const sortInverse = ( a: any , b: any ) => ( a < b ? 1 : -1 );

		const applySort = ( algo: any ) => {
			return Object.entries( result )
				.sort( ( [ a ] , [ b ] ) => {
					return algo( a as any , b as any );
				} )
				.reduce( ( r , [ k , v ] ) => ( { ...r , [ k ] : v } ) , {} );
		};

		if ( this.options.sort === "asc" ) {
			sorted = applySort( regularSort );
		} else if ( this.options.sort === "dsc" ) {
			sorted = applySort( sortInverse );
		}
		return sorted;
	}

	with( options: ISureAssignOptions = __defaults ) {

		// even check if the options are correct
		this.errorHandler.validateAssignement( __defaults , options );

		// defaults if not set
		const {
			complient = __defaults.complient ,
			verbose = __defaults.verbose ,
			passmiss = __defaults.passmiss ,
			sort = __defaults.sort ,
			unsure = __defaults.unsure ,
		} = options;

		this.options = Object.assign( this.options , {
			complient ,
			passmiss ,
			verbose ,
			sort ,
			unsure ,
		} );

		return this;
	}

	initOptions() {

		// defaults applied no matter what
		this.options = Object.assign( this.options , __defaults );
	}
}

const sureAssignDefautOptions: ISureAssignOptions = __defaults;
export { ConsistentAssigner , sureAssignDefautOptions };
