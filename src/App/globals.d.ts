
/**
 * Global typings.
 */

declare module '*.st.css' {
	// tslint:disable-next-line
	const stylesheet: import('@stylable/runtime').RuntimeStylesheet;
	export = stylesheet;
}

declare namespace React {
	// tslint:disable-next-line
	interface ImgHTMLAttributes<T> {
		loading?: string;
	}
}
