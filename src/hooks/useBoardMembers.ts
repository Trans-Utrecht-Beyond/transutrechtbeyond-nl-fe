import { Vector } from "prelude-ts";
import { useEffect, useState } from "react";
import { BoardMember, fetchBoardMembers } from "../io";

export default function useBoardMembers() {
  const [boardMembers, setBoardMembers] = useState<
    "LOADING" | "ERROR" | Vector<BoardMember>
  >("LOADING");

  useEffect(() => {
    fetchBoardMembers(undefined).then((bm): void => {
      if (bm.isLeft()) setBoardMembers("ERROR");
      else setBoardMembers(bm.get().data);
    });
  }, []);

  return boardMembers;
}
