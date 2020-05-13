export class AuthService {

    private static instance: AuthService;

    private constructor() { }

    static getInstance() {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }

        return AuthService.instance;
    }
    
    async signInWithEmailAndPassword(userId:string, password:string): Promise<any> {
        
        return Promise.resolve();
    }

    async signOut() {
        return Promise.resolve();
    }

    getCurrentLoginId():string  {
        return "currentUser";
    }

    onAuthStateChange(handleAuthStateChange:any) { }

    async generateIdToken() {
        return Promise.resolve("idToken123");
    }


}