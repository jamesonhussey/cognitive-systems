/**
 * NAME POOLS
 * 
 * Add, remove, or modify names here.
 * Names are selected randomly with equal probability.
 * 
 * Tips:
 * - First names are paired with any last name
 * - Add cultural variety as desired
 * - Keep lists balanced for natural distribution
 */

export const FIRST_NAMES = [
  // Common Western
  'James', 'Michael', 'Robert', 'David', 'William', 'Richard', 'Joseph', 'Thomas',
  'Sarah', 'Emily', 'Jessica', 'Ashley', 'Amanda', 'Stephanie', 'Jennifer', 'Elizabeth',
  
  // Additional Western
  'Daniel', 'Matthew', 'Anthony', 'Christopher', 'Andrew', 'Joshua', 'Ryan', 'Brandon',
  'Nicole', 'Megan', 'Lauren', 'Samantha', 'Katherine', 'Rebecca', 'Rachel', 'Heather',
  
  // East Asian
  'Wei', 'Ming', 'Li', 'Chen', 'Yuki', 'Hiro', 'Kenji', 'Sakura',
  'Jin', 'Soo', 'Min', 'Hana', 'Mei', 'Xiao', 'Ling', 'Yuna',
  
  // South Asian
  'Raj', 'Amit', 'Vikram', 'Arun', 'Priya', 'Ananya', 'Kavitha', 'Deepa',
  'Sanjay', 'Arjun', 'Rohan', 'Neha', 'Pooja', 'Shreya', 'Divya', 'Aisha',
  
  // Hispanic/Latino
  'Carlos', 'Miguel', 'Antonio', 'Luis', 'Sofia', 'Isabella', 'Valentina', 'Camila',
  'Diego', 'Alejandro', 'Gabriel', 'Maria', 'Carmen', 'Elena', 'Rosa', 'Ana',
  
  // Middle Eastern
  'Omar', 'Ahmed', 'Khalid', 'Hassan', 'Fatima', 'Layla', 'Nadia', 'Yasmin',
  'Ali', 'Tariq', 'Zara', 'Leila', 'Amira', 'Rania', 'Salim', 'Karim',
  
  // African
  'Kofi', 'Kwame', 'Obinna', 'Chidi', 'Amara', 'Zainab', 'Nia', 'Imani',
  'Tendai', 'Jabari', 'Malik', 'Ayana', 'Safiya', 'Kendra', 'Dara', 'Esi',
  
  // Eastern European
  'Ivan', 'Dmitri', 'Alexei', 'Nikolai', 'Natasha', 'Olga', 'Irina', 'Katya',
  'Viktor', 'Andrei', 'Sergei', 'Anya', 'Svetlana', 'Marina', 'Vera', 'Elena'
];

export const LAST_NAMES = [
  // Common Western
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson',
  'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia',
  
  // Additional Western
  'Moore', 'Taylor', 'Clark', 'Lewis', 'Walker', 'Hall', 'Allen', 'Young',
  'King', 'Wright', 'Scott', 'Green', 'Baker', 'Adams', 'Nelson', 'Carter',
  
  // East Asian
  'Chen', 'Wang', 'Li', 'Zhang', 'Liu', 'Yang', 'Huang', 'Wu',
  'Kim', 'Park', 'Lee', 'Choi', 'Tanaka', 'Suzuki', 'Watanabe', 'Yamamoto',
  
  // South Asian
  'Patel', 'Sharma', 'Singh', 'Kumar', 'Gupta', 'Reddy', 'Nair', 'Rao',
  'Chopra', 'Mehta', 'Joshi', 'Shah', 'Kapoor', 'Malhotra', 'Bhat', 'Iyer',
  
  // Hispanic/Latino
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Perez', 'Sanchez', 'Ramirez',
  'Torres', 'Flores', 'Rivera', 'Gomez', 'Diaz', 'Reyes', 'Morales', 'Cruz',
  
  // Middle Eastern
  'Al-Rashid', 'Hassan', 'Abbas', 'Khalil', 'Mansour', 'Osman', 'Nasser', 'Bakir',
  'Farah', 'Haddad', 'Khoury', 'Saleh', 'Ibrahim', 'Youssef', 'Nazari', 'Hosseini',
  
  // African
  'Okonkwo', 'Mensah', 'Diallo', 'Toure', 'Osei', 'Mbeki', 'Adeyemi', 'Kimani',
  'Traore', 'Nkomo', 'Obi', 'Achebe', 'Ndlovu', 'Okello', 'Banda', 'Kone',
  
  // Eastern European
  'Ivanov', 'Petrov', 'Volkov', 'Sokolov', 'Kuznetsov', 'Popov', 'Novak', 'Horvat',
  'Kowalski', 'Novotny', 'Babic', 'Dragomir', 'Kovalenko', 'Shevchenko', 'Zima', 'Reznik'
];

/**
 * Generate a random full name
 */
export function generateName() {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return { firstName, lastName, fullName: `${firstName} ${lastName}` };
}
