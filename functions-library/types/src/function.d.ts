export type CloudFunctionT = {
    params: any;
    onRequest: (params: any) => void;
};
export declare namespace Functions {
    /**
     * Registers Cloud function
     * @param functionObject Cloud Function
     */
    const Register: (functionObject: CloudFunctionT) => void;
}
