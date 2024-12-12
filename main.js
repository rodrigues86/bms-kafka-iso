const { Kafka } = require("kafkajs");
const fs = require("fs");

const kafka = new Kafka({
  clientId: "poc-normalize-region-language",
  brokers: [
    "b-1.prd-shared-a87h.i554oi.c24.kafka.us-east-1.amazonaws.com:9094",
    "b-2.prd-shared-a87h.i554oi.c24.kafka.us-east-1.amazonaws.com:9094",
    "b-3.prd-shared-a87h.i554oi.c24.kafka.us-east-1.amazonaws.com:9094",
  ],
  ssl: true,
});

const consumer = kafka.consumer({
  groupId: "poc-normalize-region-language-groupId",
  autoCommit: false, // NEVER TRUE
});
const topic = "camp--target-option-reach-observed-event";

const MIN_TIME = new Date("2024-11-28T00:00:00.000Z");

const optionIds = new Set();

const run = async () => {
  try {
    console.log("Conectando ao Kafka...");
    await consumer.connect();
    console.log("Conectado ao Kafka");

    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachBatch: async ({ batch }) => {
        console.log(`Batch recebido com ${batch.messages.length} mensagens`);

        batch.messages.forEach((message, index) => {
          const messageValue = message.value.toString();
          try {
            const parsedMessage = JSON.parse(messageValue);

            if (
              parsedMessage.data.optionType === "language" &&
              new Date(parsedMessage.time) >= MIN_TIME
            ) {
              console.log(`Mensagem ${index + 1} válida:`, parsedMessage);
              optionIds.add(parsedMessage.data.optionId);
            }
          } catch (error) {
            console.error(
              `Erro ao processar mensagem ${index + 1}:`,
              error.message
            );
          }
        });
      },
    });
  } catch (error) {
    console.error("Erro ao consumir mensagens:", error);
    process.exit(1);
  }
};

const saveToFile = async () => {
  console.log("Salvando dados únicos no arquivo 'optionIds.json'...");

  // Converte Set para array e salva em arquivo JSON
  const uniqueOptionIds = Array.from(optionIds);
  fs.writeFileSync("optionIds.json", JSON.stringify(uniqueOptionIds, null, 2));

  console.log(
    `Arquivo 'optionIds.json' gerado com ${uniqueOptionIds.length} itens.`
  );
};

run();

process.on("SIGINT", async () => {
  console.log("Encerrando consumidor...");
  await consumer.disconnect();
  await saveToFile();
  process.exit(0);
});
