import { AuthService } from "./AuthService";
import { MPFService } from "./MPFService";
import { ConfigService } from "./ConfigService";



export class ServiceFactory {

    static getAuthService() {
        return AuthService.getInstance();
    }

    // static getMPFService() {
    //     return 
    // }

    static getConfigService() {
        return ConfigService.getInstance();
    }

    static getMPFService() {
        return MPFService.getInstance();
    }

}