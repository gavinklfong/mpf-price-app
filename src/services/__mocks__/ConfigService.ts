

export class ConfigService {

    private static instance: ConfigService;

    static getInstance(): ConfigService {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService();
        }

        return ConfigService.instance;
    }

    private constructor() { }

    async getProperty(key:string) {
        return key + "-value";
    }


}