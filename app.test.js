const request = require('supertest');
const app = require('./app'); // Adjust the path to your Express app
const db = require('./models/database.js');


describe('Appointment Booking Workflow E2E Test', () => {
    let studentA1, studentA2, professorP1;
    let slotID_T1 , slotID_T2;

    //clear database before tests
    async function clearDatabase() {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM student', (err1) => {
                if (err1) reject(err1);
                // console.log("Student table cleared");
                db.run('DELETE FROM professor', (err2) => {
                    if (err2) reject(err2);
                    // console.log("Professor table cleared");
                    db.run('DELETE FROM slot', (err3) => {
                        if (err3) reject(err3);
                        // console.log("Slot table cleared");
                        resolve();
                    });
                });
            });
        });
    }
    
    beforeAll(async () => {
        await clearDatabase();
        console.log("Test database cleared");
    });

    test('1. Student A1 authenticates to access the system', async () => {

        const signupResponse = await request(app)
            .post('/student/signup')
            .send({
                "name": "Student A1",
                "email": "studenta1@example.com",
                "password": "passwordA1"
            });
        
        studentA1 = signupResponse.body;
        console.log(studentA1);
        expect(signupResponse.statusCode).toBe(201);

        const loginResponse = await request(app)
            .post('/student/login')
            .send({
                email: 'studenta1@example.com',
                password: 'passwordA1'
            });
        
        expect(loginResponse.statusCode).toBe(200);
    });

    test('2. Professor P1 authenticates to access the system', async () => {
        const signupResponse = await request(app)
            .post('/professor/signup')
            .send({
                name: 'Professor P1',
                email: 'professorP1@university.edu',
                password: 'passwordP1'
            });
        
        expect(signupResponse.statusCode).toBe(201);
        professorP1 = signupResponse.body;
        console.log(professorP1)

        const loginResponse = await request(app)
            .post('/professor/login')
            .send({
                email: 'professorP1@university.edu',
                password: 'passwordP1'
            });
        
        expect(loginResponse.statusCode).toBe(200);
    });

    test('3. Professor P1 specifies which time slots he is free for appointments', async () => {

        const createSlotResponse1 = await request(app)
            .post('/slot/create')
            .send({
                professor_id: professorP1.professor_id,
                start_time: 11
            });
        
        expect(createSlotResponse1.statusCode).toBe(201);
        slotID_T1= createSlotResponse1.body.slot_id;

        const createSlotResponse2 = await request(app)
        .post('/slot/create')
        .send({
            professor_id: professorP1.professor_id,
            start_time: 12
        });
    
        expect(createSlotResponse2.statusCode).toBe(201);
        slotID_T2= createSlotResponse2.body.slot_id;
        
    });
    

    test('4. Student A1 views available time slots for Professor P1', async () => {
        const availableSlotsResponse = await request(app)
            .get(`/slot/getById?professor_id=${professorP1.professor_id}`);
        
        expect(availableSlotsResponse.statusCode).toBe(200);
        expect(availableSlotsResponse.body.length).toBeGreaterThan(0);
    });

    test('5. Student A1 books an appointment with Professor P1 for time T1', async () => {
        const bookAppointmentResponse = await request(app)
            .post('/slot/book')
            .send({
                slot_id: slotID_T1,
                student_id: studentA1.student_id
            });
        
        expect(bookAppointmentResponse.statusCode).toBe(200);
        expect(bookAppointmentResponse.body.message).toBe('Appointment Booked');
    });

    test('6. Student A2 authenticates to access the system', async () => {
        // Signup Student A2
        const signupResponse = await request(app)
            .post('/student/signup')
            .send({
                name: 'Student A2',
                email: 'studenta2@example.com',
                password: 'passwordA2'
            });
        
        expect(signupResponse.statusCode).toBe(201);
        studentA2 = signupResponse.body;

        // Login Student A2
        const loginResponse = await request(app)
            .post('/student/login')
            .send({
                email: 'studenta2@example.com',
                password: 'passwordA2'
            });
        
        expect(loginResponse.statusCode).toBe(200);
    });

    test('7. Student A2 books an appointment with Professor P1 for time T2', async () => {
        const bookAppointmentResponse = await request(app)
            .post('/slot/book')
            .send({
                slot_id: slotID_T2,
                student_id: studentA2.student_id
            });
        
        expect(bookAppointmentResponse.statusCode).toBe(200);
        expect(bookAppointmentResponse.body.message).toBe('Appointment Booked');
    });

    test('8. Professor P1 cancels the appointment with Student A1', async () => {
        const cancelSlotResponse = await request(app)
            .post('/slot/cancel')
            .send({
                slot_id: slotID_T1,
                professor_id : professorP1.professor_id
            });
        
        expect(cancelSlotResponse.statusCode).toBe(200);
        expect(cancelSlotResponse.body.message).toBe('Slot Deleted');
    });

    test('9. Student A1 checks their appointments and realizes they do not have any pending appointments', async () => {
        const appointmentsResponse = await request(app)
            .get(`/student/allappointment?student_id=${studentA1.student_id}`);
        
        expect(appointmentsResponse.statusCode).toBe(200);
        expect(appointmentsResponse.body.length).toBe(0);
    });

    afterAll(async () => {
        if (app && app.close) {
            await app.close();
        }
    });
});