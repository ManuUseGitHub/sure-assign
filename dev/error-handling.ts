import { ConsistentAssigner } from ".";
import {
	ISureAssignCheck ,
	ISureAssignOnErrorObject ,
	ISureAssignValidator ,
	ISureAssignOptions ,
} from "./interfaces";

class ErrorHandler {
	assigner: ConsistentAssigner;

	constructor( assigner: ConsistentAssigner ) {
		this.assigner = assigner;
	}

	logOnVerbose( message: string , methodName = "log" ) {
		if ( this.assigner.options.verbose ) {
			( console as any )[ methodName ]( message );
		}
	}

	onFaillure(
		onError: ISureAssignOnErrorObject ,
		checks?: ISureAssignValidator
	): void {
		const { message , reason } = onError;

		if ( !checks ) {
			return;
		}

		if ( !this.assigner.options.complient ) {
			throw message;
		} else {
			this.logOnVerbose( message , "warn" );
			checks.reasons.push( reason );
		}
	}

	checkExistance( check: ISureAssignCheck ) {
		const { ciblingClassName , json , checks } = check;
		const { assigner } = this;
		const { options } = assigner;

		if ( options.unsure ) {
			this.onFaillure( {
				message : `These fields .* will been assigned to your object of type ${ciblingClassName}` ,
				reason : "unexists" ,
			} , checks );
            
		} else if ( json == null || json == undefined ) {
			this.onFaillure(
				{
					message : `Assignement failed : Cannot assign a null or unexisting object to an instance of ${ciblingClassName}` ,
					reason : "unexists" ,
				} ,
				checks
			);
		}
	}

	checkConsistancy( check: ISureAssignCheck ) {
		const { ciblingClassName , json , checks } = check;

		// The instance is not an object of a class

		if ( typeof json !== "object" ) {
			this.onFaillure(
				{
					message : `Assignement failed : Cannot assign < ${json} > of type ${json.constructor.name} with an instance of type ${ciblingClassName}` ,
					reason : "unconsistant" ,
				} ,
				checks
			);
		}
	}
	checkSimilarity( check: ISureAssignCheck ) {
		const { instance , json , checks } = check;
		let { ciblingClassName } = check;

		ciblingClassName =
			ciblingClassName === "Object" ? "Annonymous-Object" : ciblingClassName;

		// The instance and Json are the same object
		if ( Object.is( instance , json ) ) {
			this.onFaillure(
				{
					message : `Assignement failed : Cannot assign instance of type ${ciblingClassName} to itself"` ,
					reason : "similar" ,
				} ,
				checks
			);
		}
	}
	checkFieldMatch( check: ISureAssignCheck ) {
		const { ciblingClassName , instance , checks , key } = check;
		const { assigner } = this;

		const { options } = assigner;

		if ( options.unsure ) return;

		// The instance does not have field that we want to merge to
		if ( key !== undefined && !( key in instance ) ) {

			// writing the message
			const message = `Assignement failed : >${key}< is a property missing from ${ciblingClassName}.`;

			// when the assignment is not complient
			if ( assigner && !assigner.options.complient ) {

				// throw an error
				throw message;

				// otherwise
			} else {

				// log the error
				this.logOnVerbose( message , "warn" );
				checks.subset.push( key );
			}
		}
	}

	/**
	 * final test. the json should be an object of the same level as the instance or lower.
	 * if not, the json is an extension full of maybe things unwanted ... if so, it will throw
	 * @param check
	 */
	checkSizes( check: ISureAssignCheck ) {
		const { instance , json , checks , ciblingClassName } = check;

		if (
			!checks.reasons.includes( "unexists" ) &&
			!checks.reasons.includes( "unconsistant" )
		) {
			if ( json ) {
				Object.keys( json ).forEach( ( key ) => {
					this.checkFieldMatch( {
						ciblingClassName ,
						instance ,
						json ,
						checks ,
						key ,
					} );
				} );
			}
		}
	}

	validateAssignement( instance: any , json: any ) {
		const ciblingClassName = instance.constructor.name;

		const checks: ISureAssignValidator = { reasons : [] , subset : [] };

		const check = { ciblingClassName , instance , json , checks };

		this.checkExistance( check );
		this.checkSimilarity( check );
		this.checkConsistancy( check );

		this.checkSizes( { ciblingClassName , instance , json , checks } );

		if ( checks.subset.length ) {
			checks.subset.forEach( ( key ) => delete json[ key ] );
			checks.reasons.push( "missing property" );
		}

		return checks;
	}
}

export { ErrorHandler };
