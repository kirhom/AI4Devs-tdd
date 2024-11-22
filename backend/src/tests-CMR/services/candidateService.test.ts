import { addCandidate } from '../../application/services/candidateService';
import { Candidate } from '../../domain/models/Candidate';
import { Education } from '../../domain/models/Education';
import { WorkExperience } from '../../domain/models/WorkExperience';
import { Resume } from '../../domain/models/Resume';

jest.mock('../../domain/models/Education');
jest.mock('../../domain/models/WorkExperience');
jest.mock('../../domain/models/Resume');

describe('addCandidate - Validation Tests', () => {
  let saveMock: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    saveMock = jest
      .spyOn(Candidate.prototype, 'save')
      .mockImplementation(jest.fn());
  });

  afterEach(() => {
    saveMock.mockRestore();
  });

  it('should throw an error for invalid name', async () => {
    const candidateData = {
      firstName: 'J',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };

    await expect(addCandidate(candidateData)).rejects.toThrow('Invalid name');
  });

  it('should throw an error for invalid email', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@com',
    };

    await expect(addCandidate(candidateData)).rejects.toThrow('Invalid email');
  });

  it('should throw an error for invalid phone', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '123456789',
    };

    await expect(addCandidate(candidateData)).rejects.toThrow('Invalid phone');
  });

  it('should throw an error for invalid address', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      address: 'a'.repeat(101),
    };

    await expect(addCandidate(candidateData)).rejects.toThrow(
      'Invalid address',
    );
  });

  it('should throw an error for invalid education data', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      educations: [{ institution: '', title: 'B.Sc', startDate: '2020-01-01' }],
    };

    await expect(addCandidate(candidateData)).rejects.toThrow(
      'Invalid institution',
    );
  });

  it('should throw an error for invalid work experience data', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      workExperiences: [
        { company: '', position: 'Developer', startDate: '2020-01-01' },
      ],
    };

    await expect(addCandidate(candidateData)).rejects.toThrow(
      'Invalid company',
    );
  });

  it('should throw an error for invalid CV data', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      cv: { filePath: '', fileType: 'pdf' },
    };

    await expect(addCandidate(candidateData)).rejects.toThrow(
      'Invalid CV data',
    );
  });

  it('should throw an error if the email already exists', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };

    saveMock.mockImplementation(() => {
      const error = new Error(
        'Unique constraint failed on the fields: (`email`)',
      );
      (error as any).code = 'P2002';
      throw error;
    });

    await expect(addCandidate(candidateData)).rejects.toThrow(
      'The email already exists in the database',
    );
  });

  it('should save education data correctly', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      educations: [
        { institution: 'University', title: 'B.Sc', startDate: '2020-01-01' },
      ],
    };

    const savedCandidate = { id: 1, ...candidateData, education: [] };
    saveMock.mockResolvedValue(savedCandidate);
    (Education.prototype.save as jest.Mock).mockResolvedValue({});

    const result = await addCandidate(candidateData);

    expect(Candidate.prototype.save).toHaveBeenCalled();
    expect(Education.prototype.save).toHaveBeenCalled();
    expect(result).toEqual(savedCandidate);
  });

  it('should save work experience data correctly', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      workExperiences: [
        { company: 'Company', position: 'Developer', startDate: '2020-01-01' },
      ],
    };

    const savedCandidate = { id: 1, ...candidateData, workExperience: [] };
    saveMock.mockResolvedValue(savedCandidate);
    (WorkExperience.prototype.save as jest.Mock).mockResolvedValue({});

    const result = await addCandidate(candidateData);

    expect(Candidate.prototype.save).toHaveBeenCalled();
    expect(WorkExperience.prototype.save).toHaveBeenCalled();
    expect(result).toEqual(savedCandidate);
  });

  it('should save CV data correctly', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      cv: { filePath: '/path/to/resume.pdf', fileType: 'pdf' },
    };

    const savedCandidate = { id: 1, ...candidateData, resumes: [] };
    saveMock.mockResolvedValue(savedCandidate);
    (Resume.prototype.save as jest.Mock).mockResolvedValue({});

    const result = await addCandidate(candidateData);

    expect(Candidate.prototype.save).toHaveBeenCalled();
    expect(Resume.prototype.save).toHaveBeenCalled();
    expect(result).toEqual(savedCandidate);
  });

  it('should handle database errors correctly', async () => {
    // Add your test implementation here
  });
});
