export interface ISureAssignOptions {
	complient: boolean;
	verbose: boolean;
	passmiss: boolean;
	sort ? : string;
	unsure : boolean;
}

export interface ISureAssignValidator {
	reasons: string[];
	subset: any[];
}

export interface ISureAssignCheck {
	ciblingClassName: string;
	instance?: any;
	json: string;
	checks: ISureAssignValidator;
	key?: string;
}

export interface ISureAssignOnErrorObject {
	message: string;
	reason: string;
}
