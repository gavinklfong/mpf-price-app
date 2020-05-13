
import { getFirebaseInstance } from '../FirebaseService';
jest.mock('../FirebaseService');

import { AuthService } from '../AuthService';

const mockedGetFirebaseInstance = getFirebaseInstance as jest.Mock<any>

const MOCK_ID_TOKEN = "mockIdToken123"; 
const getIdToken = jest.fn(() => {
    return MOCK_ID_TOKEN;
});
const signInWithEmailAndPassword = jest.fn(() => { });
const signOut = jest.fn(() => {});
const setPersistence = jest.fn(() => {});

mockedGetFirebaseInstance.mockImplementation(() => (
     {
        auth: jest.fn(() => (
             {
                currentUser: {
                    getIdToken: getIdToken
                },
                signInWithEmailAndPassword: signInWithEmailAndPassword,
                signOut: signOut,
                setPersistence: setPersistence
            }))
    }
))


describe("AuthService", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    })

    test('getInstance', () => {

        const authService = AuthService.getInstance();
        expect(authService).toBeDefined();
    });

    test('generateIdToken', async () => {

        const authService = AuthService.getInstance();
        const idToken = await authService.generateIdToken()
        expect(getIdToken).toHaveBeenCalledTimes(1);
        expect(idToken).toBe(MOCK_ID_TOKEN);
    
    });

    test('signInWithEmailAndPassword', async () => {

        const authService = AuthService.getInstance();
        await authService.signInWithEmailAndPassword("userId123", "password123");
        expect(signOut).toHaveBeenCalledTimes(1);
        expect(setPersistence).toHaveBeenCalledTimes(1);
        expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1);

    });

    test('signOut', async () => {
        const authService = AuthService.getInstance();
        await authService.signOut();
        expect(signOut).toHaveBeenCalledTimes(1);
    });

    test('getCurrentLoginId', () => {
        const authService = AuthService.getInstance();
        const currentLoginId = authService.getCurrentLoginId();
        expect(currentLoginId).toBeDefined();
    });

});


