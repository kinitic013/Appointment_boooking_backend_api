```mermaid
erDiagram
    STUDENT ||--o{ SLOT : books
    PROFESSOR ||--o{ SLOT : creates
    
    STUDENT {
        int student_id PK
        string name
        string email
        string password
    }
    
    PROFESSOR {
        int professor_id PK
        string name
        string email
        string password
    }
    
    SLOT {
        int slot_id PK
        int professor_id FK
        datetime start_time
        boolean isBooked
        int student_id FK
    }
