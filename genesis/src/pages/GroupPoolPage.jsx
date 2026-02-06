import React, { useState } from "react";
import { ethers } from "ethers";
import { getFactoryContract } from "../utils/contract";

const GroupPoolPage = () => {
  const [contribution, setContribution] = useState("");
  const [members, setMembers] = useState("");

  const handleCreateGroup = async () => {
    try {
      const factory = await getFactoryContract();

     const tx = await factory.createGroupPool(
);


      await tx.wait();

      alert("Group Pool Created Successfully!");
    } catch (error) {
      console.error(error);
      alert("Error creating group");
    }
  };

  return (
    <div>
      <h2>Create Group Pool</h2>

      {/* <input
        type="text"
        placeholder="Contribution in ETH"
        value={contribution}
        onChange={(e) => setContribution(e.target.value)}
      />

      <input
        type="number"
        placeholder="Number of Members"
        value={members}
        onChange={(e) => setMembers(e.target.value)}
      /> */}

      <button onClick={handleCreateGroup}>Create Pool</button>
    </div>
  );
};

export default GroupPoolPage;
