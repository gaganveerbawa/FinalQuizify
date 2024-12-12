// import { useState } from "react";
// import QuizModal from "./QuizModal";
// import QuizQuestions from "./QuizQuestions";
// import ShareModal from "./ShareModal";

// function ParentComponent() {
//   const [isQuizModalOpen, setIsQuizModalOpen] = useState(true);
//   const [isShareModalOpen, setIsShareModalOpen] = useState(false);

//   const handleCloseQuizModal = () => {
//     setIsQuizModalOpen(false);
//   };

//   const handleQuizCreate = () => {
//     setIsQuizModalOpen(false);
//     setIsShareModalOpen(true);
//   };

//   const handleCloseShareModal = () => {
//     setIsShareModalOpen(false);
//   };

//   return (
//     <>
//       {isQuizModalOpen && (
//         <QuizModal
//           isOpen={isQuizModalOpen}
//           onClose={handleCloseQuizModal}
//           onQuizCreate={handleQuizCreate}
//         >
//           <QuizQuestions />
//         </QuizModal>
//       )}

//       {isShareModalOpen && <ShareModal onClose={handleCloseShareModal} />}
//     </>
//   );
// }

// export default ParentComponent;
