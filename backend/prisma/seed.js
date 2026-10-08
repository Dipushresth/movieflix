import bcrypt from "bcrypt";
import readline from "readline";
import prisma from "../prismaClient/client.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  console.log("Create Movieflix Admin");
  console.log("------------------------");

  const name = await ask("Admin name: ");
  const email = await ask("Admin email: ");
  const password = await ask("Admin password: ");

  if (!name || !email || !password) {
    throw new Error("Name, email and password are required.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: {
      email,
    },

    update: {
      role: "ADMIN",
    },

    create: {
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("\nAdmin created/updated successfully.");
  console.log({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  });
}

main()
  .catch((error) => {
    console.error("\nError:", error);
    process.exit(1);
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });
