import data from '@/data/courses.json';

export type Course = {
  id: string;
  courseName: string;
  isoVersion: string;
  courseType: string;
  subCategory: string;
  description: string;
  startDate: string;
  endDate: string;
  duration: string;
  feeInr: number;
  keySyllabusOutcomes: string[];
};

export const courses = data as Course[];

export const courseTypes = ['Management Systems & Certifications', 'Academy & Tech Training'] as const;

export const getCourse = (id?: string) => courses.find((c) => c.id === id);

/** Only batches that have not yet finished are shown. */
export const upcomingCourses = (now = new Date()) =>
  courses.filter((c) => new Date(`${c.endDate}T23:59:59Z`) >= now).sort((a, b) => a.startDate.localeCompare(b.startDate));

const dateFmt = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
export const formatDate = (iso: string) => dateFmt.format(new Date(`${iso}T00:00:00Z`));
export const formatRange = (c: Pick<Course, 'startDate' | 'endDate'>) => `${formatDate(c.startDate)} – ${formatDate(c.endDate)}`;
export const formatFee = (fee: number) => `₹${fee.toLocaleString('en-IN')}`;
