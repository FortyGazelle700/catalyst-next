import { eq } from "drizzle-orm";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { revalidateTag, unstable_cache } from "next/cache";
import postgres from "postgres";

declare global {
  var courseClassifications: Map<string, string>;
}

const sql =
  global.db ??
  postgres(process.env.DATABASE_URL!, {
    max: 1,
    ssl: "require",
  });

global.db ??= drizzle(sql as unknown as postgres.Sql<Record<string, unknown>>);

const defaultDataset = [
  { text: "input: BVW Counseling" },
  { text: "output: Persistent" },
  { text: "input: Health Wellness (online)-Haggerty-SU" },
  { text: "output: Physical Education" },
  { text: "input: BVW Library 2022-2023" },
  { text: "output: Persistent" },
  { text: "input: PRMS Counseling" },
  { text: "output: Persistent" },
  { text: "input: Sources of Strength" },
  { text: "output: Activity" },
  { text: "input: 1. Advanced Math O'Neal-Q4" },
  { text: "output: Math" },
  { text: "input: 6th Grade Band" },
  { text: "output: Arts" },
  { text: "input: 2021 Advanced Integrated Mathematics 7-O'Neal-Q3" },
  { text: "output: Math" },
  { text: "input: 2021 Summer Band" },
  { text: "output: Activity" },
  { text: "input: Advanced Integrated Mathematics 6-White-Q1" },
  { text: "output: Math" },
  { text: "input: Advanced Integrated Mathematics 6-White-Q2" },
  { text: "output: Math" },
  { text: "input: Advanced Integrated Mathematics 6-White-Q3" },
  { text: "output: Math" },
  { text: "input: Advanced Integrated Mathematics 6-White-Q4" },
  { text: "output: Math" },
  { text: "input: Advanced Integrated Mathematics 7-Mitchem-Q1" },
  { text: "output: Math" },
  { text: "input: Advisory -9th Grade-Hoyt-YR" },
  { text: "output: Persistent" },
  { text: "input: Algebra 1 Qtr 1-Fleer-Q1" },
  { text: "output: Math" },
  { text: "input: Algebra 1 Qtr 2-Fleer-Q2" },
  { text: "output: Math" },
  { text: "input: Algebra 1 Qtr 3-Fleer-Q3" },
  { text: "output: Math" },
  { text: "input: Algebra 1 Qtr 4-Fleer-Q4" },
  { text: "output: Math" },
  { text: "input: Art 6 (Q2)" },
  { text: "output: Arts" },
  { text: "input: Band 6 Quarter 4-Gamble-Q4" },
  { text: "output: Arts" },
  { text: "input: Band 6-Gamble-Q1" },
  { text: "output: Arts" },
  { text: "input: Band 6-Q3" },
  { text: "output: Arts" },
  { text: "input: Band 7 Quarter 3-Gamble-Q3" },
  { text: "output: Arts" },
  { text: "input: Band 7 Quarter 4-Gamble-Q4" },
  { text: "output: Arts" },
  { text: "input: Band 8 Quarter 1-Gamble-Q1" },
  { text: "output: Arts" },
  { text: "input: Band 8 Quarter 2-Gamble-Q2" },
  { text: "output: Arts" },
  { text: "input: Band 8 Quarter 3-Gamble-Q3" },
  { text: "output: Arts" },
  { text: "input: Band 8 Quarter 4-Gamble-Q4" },
  { text: "output: Arts" },
  { text: "input: CHE 5th Grade Art" },
  { text: "output: Arts" },
  { text: "input: E.L.A. 7 Q3-Kennedy" },
  { text: "output: English" },
  { text: "input: ELA 7 Q2 Virtual" },
  { text: "output: English" },
  { text: "input: ELA Q4 Kennedy" },
  { text: "output: English" },
  { text: "input: Elementary Band Grade 5-Gamble-YR" },
  { text: "output: Arts" },
  { text: "input: Elementary Foreign Language Spanish Grade 4-Davidson-YR" },
  { text: "output: Language" },
  { text: "input: Elementary General Classroom Grade 4-Schwabauer-YR" },
  { text: "output: Persistent" },
  { text: "input: Elementary General Classroom Grade 5-Auvigne-YR" },
  { text: "output: Persistent" },
  { text: "input: Elementary Mathematics Grade 5-Auvigne-YR" },
  { text: "output: Math" },
  { text: "input: English Language Arts 6 Quarter 1-Mensendiek-Q1" },
  { text: "output: English" },
  { text: "input: English Language Arts 6 Quarter 2-Mensendiek-Q2" },
  { text: "output: English" },
  { text: "input: English Language Arts 6 Quarter 3-Mensendiek-Q3" },
  { text: "output: English" },
  { text: "input: English Language Arts 6 Quarter 4-Mensendiek-Q4" },
  { text: "output: English" },
  { text: "input: English Language Arts 8 Quarter 1-Secrest-Q1" },
  { text: "output: English" },
  { text: "input: English Language Arts 8 Quarter 2-Secrest-Q2" },
  { text: "output: English" },
  { text: "input: English Language Arts 8 Quarter 3-Secrest-Q3" },
  { text: "output: English" },
  { text: "input: English Language Arts 8 Quarter 4-Secrest-Q4" },
  { text: "output: English" },
  { text: "input: Flex Class-Fleer-YR" },
  { text: "output: Persistent" },
  { text: "input: Flex Class-Kennedy-YR" },
  { text: "output: Persistent" },
  { text: "input: Flex Class-Stanfield-YR" },
  { text: "output: Persistent" },
  { text: "input: Hnrs Biology-Hall-S2" },
  { text: "output: Science" },
  { text: "input: Hnrs Biology-Skakal-S1" },
  { text: "output: Science" },
  { text: "input: Hnrs Geometry-Young-S1" },
  { text: "output: Math" },
  { text: "input: Hnrs Geometry-Young-S2" },
  { text: "output: Math" },
  { text: "input: Honors ELA 9 - Fall 2022" },
  { text: "output: English" },
  { text: "input: Virtual Physical Education 7-Maasen-Q2" },
  { text: "output: Physical Education" },
  { text: "input: Virtual Physical Education 7-Maasen-Q1" },
  { text: "output: Physical Education" },
  { text: "input: Spanish 3.0-Horstick-S1" },
  { text: "output: Language" },
  { text: "input: Intervention 7-Kennedy-YR" },
  { text: "output: Persistent" },
  { text: "input: Introduction to Engineering Design-Vodehnal-S1" },
  { text: "output: Technology" },
  { text: "input: Introduction to Engineering Design-Vodehnal-S2" },
  { text: "output: Technology" },
  { text: "input: Jag Hub 2022-23" },
  { text: "output: Persistent" },
  { text: "input: Physical Education 6-Long-Q1" },
  { text: "output: Physical Education" },
  { text: "input: Physical Education 6-Long-Q2" },
  { text: "output: Physical Education" },
  { text: "input: Physical Education 8-Rutherford-Q1" },
  { text: "output: Physical Education" },
  { text: "input: Physical Education 8-Rutherford-Q2" },
  { text: "output: Physical Education" },
  { text: "input: Physical Education-Lowe-S1" },
  { text: "output: Physical Education" },
  { text: "input: Physical Education-Lowe-S2" },
  { text: "output: Physical Education" },
  { text: "input: Pre-Engineering Robotics 7-Shatzer-Q4" },
  { text: "output: Technology" },
  { text: "input: Pre-Engineering & Robotics 7-Shatzer-Q3" },
  { text: "output: Technology" },
  { text: "input: Pre-engineering 6-Shatzer-Q4" },
  { text: "output: Technology" },
  { text: "input: Pre-engineering 8-Shatzer-Q3" },
  { text: "output: Technology" },
  { text: "input: Pre-engineering 8-Shatzer-Q4" },
  { text: "output: Technology" },
  { text: "input: Science - Jackson - Q3" },
  { text: "output: Science" },
  { text: "input: Science 6 Quarter 1-Stanfield-Q1" },
  { text: "output: Science" },
  { text: "input: Science 6 Quarter 2-Stanfield-Q2" },
  { text: "output: Science" },
  { text: "input: Science 6 Quarter 3-Stanfield-Q3" },
  { text: "output: Science" },
  { text: "input: Science 6 Quarter 4-Stanfield-Q4" },
  { text: "output: Science" },
  { text: "input: Science 7 Quarter 1-Durick-Q1" },
  { text: "output: Science" },
  { text: "input: Science 7 Quarter 2-Durick-Q2" },
  { text: "output: Science" },
  { text: "input: Science 7: Q3" },
  { text: "output: Science" },
  { text: "input: Science 7: Q4" },
  { text: "output: Science" },
  { text: "input: Science 8 Quarter 1-Jackson-Q1" },
  { text: "output: Science" },
  { text: "input: Science 8 Quarter 2-Jackson-Q2" },
  { text: "output: Science" },
  { text: "input: Science 8 Quarter 4-Jackson-Q4" },
  { text: "output: Science" },
  { text: "input: Social Studies 6 Quarter 1-Stanfield-Q1" },
  { text: "output: Social Studies" },
  { text: "input: Social Studies 6 Quarter 2-Stanfield-Q2" },
  { text: "output: Social Studies" },
  { text: "input: Social Studies 6 Quarter 3-Stanfield-Q3" },
  { text: "output: Social Studies" },
  { text: "input: Social Studies 6 Quarter 4-Stanfield-Q4" },
  { text: "output: Social Studies" },
  { text: "input: Social Studies 7 Q 3-Kennedy" },
  { text: "output: Social Studies" },
  { text: "input: Social Studies 7 Quarter 4-Kennedy-Q4" },
  { text: "output: Social Studies" },
  { text: "input: Social Studies 8 Quarter 1-Modelski-Q1" },
  { text: "output: Social Studies" },
  { text: "input: Social Studies 8 Quarter 3-Modelski-Q3" },
  { text: "output: Social Studies" },
  { text: "input: Spanish 1A-Payne-Q3" },
  { text: "output: Language" },
  { text: "input: Spanish 1A-Payne-Q4" },
  { text: "output: Language" },
  { text: "input: Spanish 1B-Landeras-S2" },
  { text: "output: Language" },
  { text: "input: Spanish 1B-Vater-S1" },
  { text: "output: Language" },
  { text: "input: Spanish 2-Kessens-S1" },
  { text: "output: Language" },
  { text: "input: Spanish 2-Kessens-S2" },
  { text: "output: Language" },
  { text: "input: Spanish 3.0-Horstick-S1" },
  { text: "output: Language" },
  { text: "input: Spanish 3.0-Horstick-S2" },
  { text: "output: Language" },
  { text: "input: Symphonic Band - 2023" },
  { text: "output: Arts" },
  { text: "input: Technology Explorations 6-Anderson-Q1" },
  { text: "output: Technology" },
  { text: "input: VEd Social Studies 7 - Q1" },
  { text: "output: Social Studies" },
  { text: "input: Ved Social Studies 7 Q2" },
  { text: "output: Social Studies" },
  { text: "input: Virtual Advanced Mathematics 7-Mitchem-Q2" },
  { text: "output: Math" },
  { text: "input: Virtual ELA - Q1" },
  { text: "output: English" },
  { text: "input: Virtual Physical Education 7-Maasen-Q1" },
  { text: "output: Physical Education" },
  { text: "input: Virtual Physical Education 7-Maasen-Q2" },
  { text: "output: Physical Education" },
  { text: "input: VirtualED - 7th Grade Band" },
  { text: "output: Arts" },
  { text: "input: VirtualED Band 7 - Q2" },
  { text: "output: Arts" },
  { text: "input: Theatre 6-Shute-Q3" },
  { text: "output: Arts" },
  { text: "input: Elementary Reading Grade 4-Schwabauer-YR" },
  { text: "output: English" },
  { text: "input: BVW Esports" },
  { text: "output: Activity" },
  { text: "input: AP English Language Composition-EL0310-Signer-6" },
  { text: "output: English" },
];

export const getClassification = async (courseName: string) => {
  globalThis.courseClassifications ??= new Map<string, string>();
  const { revalidateTag, unstable_cache } = await import("next/cache");

  if (globalThis.courseClassifications.has(courseName)) {
    return globalThis.courseClassifications.get(courseName);
  }
  return await unstable_cache(
    async () => {
      const result = await generateClassification(courseName);
      if (result == "Not Available") {
        setTimeout(() => {
          revalidateTag(`course_classify_${courseName}`);
        }, 10000);
      } else {
        globalThis.courseClassifications.set(courseName, result);
      }
      return result;
    },
    [`course_classify_${courseName}`],
    {
      revalidate: 60 * 60 * 24 * 30,
    },
  )();
};

const generateClassification = async (courseName: string) => {
  const { courseClassification } = await import("@/server/db/schema");

  const db = globalThis.db as PostgresJsDatabase<Record<string, never>> & {
    $client: postgres.Sql<Record<string, never>>;
  };

  const dbValue = await unstable_cache(
    async () =>
      await db
        .select()
        .from(courseClassification)
        .where(eq(courseClassification.key, courseName))
        .limit(1),
    [`course_classify_db`],
  )();

  if (dbValue.length > 0 && dbValue[0]!.value) {
    return dbValue[0]!.value;
  }

  const dbValues = await unstable_cache(
    async () =>
      await db
        .select()
        .from(courseClassification)
        .where(eq(courseClassification.saveToDataset, true))
        .limit(500),
    [`course_classify_db`],
  )();

  const { GoogleGenerativeAI } = await import("@google/generative-ai");

  const courseClassificationDataset = dbValues.length
    ? dbValues
        .map((v) => ({ text: `input: ${v.key}` }))
        .concat(dbValues.map((v) => ({ text: `output: ${v.value}` })))
    : defaultDataset;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  const model = genAI.getGenerativeModel({
    // model: "gemini-1.5-flash",
    model: "gemini-flash-lite-latest",
    systemInstruction: "return the output value",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 100,
    stopSequences: ["input:", "\n"],
    responseMimeType: "text/plain",
  };

  const input = [
    ...courseClassificationDataset,
    {
      text: "input: " + courseName,
    },
    {
      text: "output: ",
    },
  ];

  let result;
  try {
    result = await model
      .generateContent({
        contents: [{ role: "user", parts: input }],
        generationConfig,
      })
      .catch((err) => {
        console.error(err);
        return {
          response: { text: () => "Not Available" },
        };
      });
  } catch (err) {
    console.error(err);
    return "Not Available";
  }

  const value =
    result?.response?.text()?.split("\n")[0]?.split("output:")?.[0]?.trim() ??
    "Not Available";

  if (value != "Not Available") {
    await db.insert(courseClassification).values({
      key: courseName,
      value: value,
    });
    revalidateTag(`course_classify_db`);
  }

  return value;
};
