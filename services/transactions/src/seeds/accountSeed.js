
import { db } from "../db/client.js";
import { accounts } from "../db/schemas/accountSchema.js";

async function seed() {
    console.log("🌱 Seeding database...");

    await db.delete(accounts); // smaže existující data (volitelné)

    await db.insert(accounts).values([
        {
            accountId: "acc_demo_1",
            userId: "user_1",
            institutionId: "bank_0100",
            accountNumber: "202404001/0100",
            name: "Osobní účet",
            currency: "CZK",
            balance: 15000,
            isActive: true,
            createdAt: new Date()
        },
        {
            accountId: "acc_demo_2",
            userId: "user_1",
            institutionId: "bank_0100",
            accountNumber: "202404002/0100",
            name: "Spořicí účet",
            currency: "CZK",
            balance: 85000,
            isActive: true,
            createdAt: new Date()
        },
        {
            accountId: "acc_demo_3",
            userId: "user_2",
            institutionId: "bank_0300",
            accountNumber: "202404003/0300",
            name: "Účet pro studium",
            currency: "CZK",
            balance: 3200,
            isActive: true,
            createdAt: new Date()
        }
    ]);

    console.log("✅ Seed hotový");
    process.exit(0);
}

seed().catch(err => {
    console.error("❌ Seed selhal", err);
    process.exit(1);
});
