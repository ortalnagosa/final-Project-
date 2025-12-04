import { Card, Button } from "flowbite-react";
import bgAbout from "../../img/about.jpg"; // תמונת רקע אם יש


export default function About() {
    return (
      <div
        className="dark:bg-gray-400 flex flex-col items-center justify-center bg-contain bg-no-repeat bg-center p-1"
        style={{ backgroundImage: `url(${bgAbout})` }}
      >
        <Card className="max-w-3xl bg-white/60 p-6 shadow-lg backdrop-blur-sm dark:bg-white/25">
          <h1 className="mb-4 text-center text-4xl font-bold text-blue-500 ">
            אודות האתר שלנו
          </h1>
          <p className="mb-4 text-center text-lg text-gray-700">
            ברוכים הבאים לאתר שלנו – הפלטפורמה המותאמת אישית לחיילים משוחררים.
            המטרה שלנו היא להקל על התהליך המורכב של המעבר מהשירות הצבאי לחיים
            האזרחיים, ולספק לכם כלים, מידע ותמיכה במקום אחד.{" "}
          </p>
          <h2 className="mb-4 text-center text-2xl font-semibold text-blue-500 ">
            מה תוכלו למצוא אצלנו?
          </h2>
          <p className="mb-4 text-center text-lg text-gray-700">
            ה האתר מציע לכם אפשרות ליצור פרופיל אישי, לעקוב אחרי התקדמות, ולנהל
            משימות חשובות בצורה מסודרת. בנוסף, תוכלו למצוא מידע מקצועי על חינוך,
            תעסוקה, ושירותי בריאות שמותאמים במיוחד לחיילים משוחררים.
          </p>
          <h2 className="mb-4 text-center text-2xl font-semibold text-blue-500 ">
            קהילה תומכת
          </h2>
          <p className="mb-4 text-center text-lg text-gray-700">
            אנו מאמינים שבחיים האזרחיים חשוב שיהיה מקום לתמיכה ושיתוף. באתר
            תוכלו להתחבר לקהילה של חיילים משוחררים אחרים, לשאול שאלות, לשתף
            חוויות ולקבל טיפים שימושיים. כך נוצר מרחב שבו תוכלו ללמוד, לייעץ
            ולהרגיש חלק מקהילה תומכת.
          </p>
          <h2 className="mb-4 text-center text-2xl font-semibold text-blue-500 ">
            כלים מותאמים אישית
          </h2>
          <p className="mb-4 text-center text-lg text-gray-700">
            האתר כולל מערכת ניהול כרטיסים אישיים, לוחות זמנים, ומעקב אחרי מסמכים
            חשובים. הכלים שלנו מסודרים כך שתוכלו להתמקד במה שחשוב באמת – בניית
            חיים חדשים בצורה מסודרת ובטוחה.
          </p>
          <h2 className="mb-4 text-center text-2xl font-semibold text-blue-500 ">
            חוויית משתמש קלה וברורה
          </h2>
          <p className="mb-4 text-center text-lg text-gray-700">
            עיצוב האתר רספונסיבי ונגיש מכל מכשיר, עם ממשק נקי וידידותי. כל פעולה
            פשוטה וברורה – מהרשמה, יצירת פרופיל, ועד שימוש בכלים המתקדמים שלנו.
          </p>
          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-blue-500 hover:bg-blue-400"
            >
              חזרה למעלה
            </Button>
          </div>
        </Card>
      </div>
    );
}
