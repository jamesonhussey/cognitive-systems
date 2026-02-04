/**
 * DEPARTMENTS AND JOB ROLES
 * 
 * Defines the organizational structure of the Verity Systems branch office.
 * Each department has roles with associated floor assignments and responsibilities.
 * 
 * Structure:
 * - id: Unique identifier
 * - name: Display name
 * - description: What this department does
 * - floor: Which floor(s) this department occupies
 * - roles: Available job positions within the department
 *   - id: Role identifier
 *   - title: Job title
 *   - isFixed: If true, exactly one person fills this role (e.g., department head)
 *   - count: For non-fixed roles, how many people (min/max)
 *   - seniority: 1-5 scale affecting salary, clearance, authority
 *   - responsibilities: What they do (for behavior/memory generation)
 * 
 * Note: Player is remote Cognitive Adjustment specialist, not in this office.
 */

export const DEPARTMENTS = [
  {
    id: 'management',
    name: 'Management',
    description: 'Executive leadership and department oversight',
    floor: 4, // Top floor
    roles: [
      {
        id: 'branch_director',
        title: 'Branch Director',
        isFixed: true,
        seniority: 5,
        responsibilities: ['oversee operations', 'approve projects', 'report to headquarters']
      },
      {
        id: 'operations_manager',
        title: 'Operations Manager',
        isFixed: true,
        seniority: 4,
        responsibilities: ['coordinate departments', 'handle logistics', 'manage schedules']
      }
    ]
  },
  {
    id: 'hr',
    name: 'Human Resources',
    description: 'Employee management, onboarding, and "wellness"',
    floor: 4,
    roles: [
      {
        id: 'hr_director',
        title: 'HR Director',
        isFixed: true,
        seniority: 4,
        responsibilities: ['oversee personnel', 'handle sensitive matters', 'employee wellness']
      },
      {
        id: 'hr_representative',
        title: 'HR Representative',
        isFixed: false,
        count: { min: 1, max: 2 },
        seniority: 2,
        responsibilities: ['onboarding', 'paperwork', 'employee support']
      }
    ]
  },
  {
    id: 'research',
    name: 'Research & Development',
    description: 'Cognitive technology research and methodology development',
    floor: 3,
    roles: [
      {
        id: 'research_director',
        title: 'Research Director',
        isFixed: true,
        seniority: 4,
        responsibilities: ['lead research initiatives', 'publish findings', 'develop new techniques']
      },
      {
        id: 'senior_researcher',
        title: 'Senior Researcher',
        isFixed: false,
        count: { min: 1, max: 3 },
        seniority: 3,
        responsibilities: ['conduct experiments', 'analyze data', 'mentor juniors']
      },
      {
        id: 'research_assistant',
        title: 'Research Assistant',
        isFixed: false,
        count: { min: 2, max: 4 },
        seniority: 1,
        responsibilities: ['assist experiments', 'data entry', 'literature review']
      }
    ]
  },
  {
    id: 'it',
    name: 'Information Technology',
    description: 'Systems maintenance, security, and technical support',
    floor: 2,
    roles: [
      {
        id: 'it_manager',
        title: 'IT Manager',
        isFixed: true,
        seniority: 3,
        responsibilities: ['oversee systems', 'security protocols', 'infrastructure']
      },
      {
        id: 'systems_admin',
        title: 'Systems Administrator',
        isFixed: false,
        count: { min: 1, max: 2 },
        seniority: 2,
        responsibilities: ['maintain servers', 'manage access', 'troubleshoot']
      },
      {
        id: 'it_support',
        title: 'IT Support Technician',
        isFixed: false,
        count: { min: 1, max: 2 },
        seniority: 1,
        responsibilities: ['help desk', 'hardware issues', 'user support']
      }
    ]
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Physical and informational security',
    floor: 1, // Ground floor
    roles: [
      {
        id: 'security_chief',
        title: 'Chief of Security',
        isFixed: true,
        seniority: 3,
        responsibilities: ['security protocols', 'incident response', 'access control']
      },
      {
        id: 'security_officer',
        title: 'Security Officer',
        isFixed: false,
        count: { min: 2, max: 3 },
        seniority: 1,
        responsibilities: ['patrols', 'monitor cameras', 'check badges']
      }
    ]
  },
  {
    id: 'sales',
    name: 'Sales & Client Relations',
    description: 'Government contracts, external clients, product services',
    floor: 2,
    roles: [
      {
        id: 'sales_director',
        title: 'Sales Director',
        isFixed: true,
        seniority: 4,
        responsibilities: ['secure contracts', 'client relationships', 'revenue targets']
      },
      {
        id: 'account_manager',
        title: 'Account Manager',
        isFixed: false,
        count: { min: 2, max: 3 },
        seniority: 2,
        responsibilities: ['manage client accounts', 'handle inquiries', 'coordinate services']
      },
      {
        id: 'sales_representative',
        title: 'Sales Representative',
        isFixed: false,
        count: { min: 1, max: 2 },
        seniority: 1,
        responsibilities: ['outreach', 'presentations', 'lead generation']
      }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Brand management, communications, and public relations',
    floor: 2,
    roles: [
      {
        id: 'marketing_manager',
        title: 'Marketing Manager',
        isFixed: true,
        seniority: 3,
        responsibilities: ['brand strategy', 'campaign management', 'public image']
      },
      {
        id: 'marketing_specialist',
        title: 'Marketing Specialist',
        isFixed: false,
        count: { min: 1, max: 2 },
        seniority: 2,
        responsibilities: ['content creation', 'social media', 'analytics']
      }
    ]
  },
  {
    id: 'admin',
    name: 'Administration',
    description: 'General office administration and support',
    floor: 1,
    roles: [
      {
        id: 'office_manager',
        title: 'Office Manager',
        isFixed: true,
        seniority: 2,
        responsibilities: ['facilities', 'supplies', 'general coordination']
      },
      {
        id: 'receptionist',
        title: 'Receptionist',
        isFixed: true,
        seniority: 1,
        responsibilities: ['greet visitors', 'answer phones', 'direct inquiries']
      },
      {
        id: 'admin_assistant',
        title: 'Administrative Assistant',
        isFixed: false,
        count: { min: 1, max: 2 },
        seniority: 1,
        responsibilities: ['scheduling', 'filing', 'general support']
      }
    ]
  }
];

/**
 * FLOOR LAYOUT
 * 
 * Defines what's on each floor for navigation and room placement.
 * Living quarters are in a separate wing/basement.
 */
export const FLOORS = [
  {
    floor: 1,
    name: 'Ground Floor',
    departments: ['security', 'admin'],
    commonAreas: ['lobby', 'reception', 'break_room_1']
  },
  {
    floor: 2,
    name: 'Operations Floor',
    departments: ['it', 'sales', 'marketing'],
    commonAreas: ['break_room_2', 'small_conference']
  },
  {
    floor: 3,
    name: 'Research Floor',
    departments: ['research'],
    commonAreas: ['lab', 'break_room_3', 'large_conference']
  },
  {
    floor: 4,
    name: 'Executive Floor',
    departments: ['management', 'hr'],
    commonAreas: ['executive_lounge', 'boardroom']
  },
  {
    floor: 0, // Basement / separate wing
    name: 'Living Quarters',
    departments: [],
    commonAreas: ['dormitory', 'cafeteria', 'gym', 'common_room']
  }
];

/**
 * Get all roles that need to be filled
 * Returns array of { departmentId, role, count }
 */
export function getAllRolesToFill() {
  const roles = [];
  
  for (const dept of DEPARTMENTS) {
    for (const role of dept.roles) {
      if (role.isFixed) {
        roles.push({ departmentId: dept.id, departmentName: dept.name, role, count: 1 });
      } else {
        const count = Math.floor(Math.random() * (role.count.max - role.count.min + 1)) + role.count.min;
        roles.push({ departmentId: dept.id, departmentName: dept.name, role, count });
      }
    }
  }
  
  return roles;
}

/**
 * Get department by ID
 */
export function getDepartment(id) {
  return DEPARTMENTS.find(d => d.id === id);
}

/**
 * Get floor info by floor number
 */
export function getFloor(floorNum) {
  return FLOORS.find(f => f.floor === floorNum);
}
