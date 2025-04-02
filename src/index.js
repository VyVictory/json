const fs = require("fs");
const readline = require("readline");
const startDir = "../data/";

function readJsonFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
}

// menu chinsh
function mainMenu() {
  console.log("\n--- HE THONG QUAN LY PHONG NET ---");
  console.log("1. Dang nhap");
  console.log("2. Thoat");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Lua chon: ", (choice) => {
    switch (choice) {
      case "1":
        login(rl);
        break;
      default:
        console.log("Cam on da su dung he thong!");
        rl.close();
        break;
    }
  });
  return;
}

// Hàm đăng nhập và chọn chức năng tương ứnh
async function login(rl) {
  console.log("\n--- DANG NHAP HE THONG ---");
  rl.question(
    "Chon vai tro (1: Nguoi choi, 2: Nhan vien, 3: Quan tri): ",
    async (roleChoice) => {
      let filePath;
      switch (roleChoice) {
        case "1":
          filePath = `${startDir}player.json`;
          break;
        case "2":
          filePath = `${startDir}staff.json`;
          break;
        case "3":
          filePath = `${startDir}admin.json`;
          break;
        default:
          console.log("Thoat.");
          mainMenu();
          return;
      }
      rl.question("Nhap ten dang nhap: ", async (username) => {
        rl.question("Nhap mat khau: ", async (password) => {
          try {
            const data = await readJsonFile(filePath);
            const accounts = data[Object.keys(data)[0]];
            const user = accounts.find(
              (acc) => acc.username === username && acc.password === password
            );

            if (!user) {
              console.log(
                "Dang nhap that bai! Kiem tra lai tai khoan hoac mat khau."
              );
              mainMenu();
              return;
            }

            console.log(`Dang nhap thanh cong, xin chao ${user.username}!`);
            switch (roleChoice) {
              case "1":
                await playerFunctions(rl, user);
                break;
              case "2":
                await staffFunctions(rl, user);
                break;
              default:
                await adminFunctions(rl, user);
                break;
            }
          } catch (error) {
            console.log("Loi doc file:", error);
            mainMenu();
          }
        });
      });
    }
  );
  return;
}

// Hàm chức năng người chơiu
async function playerFunctions(rl, player) {
  console.log("\n--- CHUC NANG NGUOI CHOI ---");
  console.log("1. Tong thoi gian ban muon choi game");
  console.log("2. Kiem tra so tien trong tai khoan");
  console.log("3. Nap tien vao tai khoan");
  console.log("4. Quay lai menu chinh");

  rl.question("Lua chon: ", async (choice) => {
    switch (choice) {
      case "1":
        rl.question("Nhap thoi gian choi (phut): ", async (time) => {
          const cost = time * 100;
          if (player.balance >= cost) {
            player.balance -= cost;
            console.log(
              `Da tru ${cost} VND. So du con lai: ${player.balance} VND`
            );
            await updateUserData(player, "player.json");
          } else {
            console.log("Tai khoan cua ban khong du tien.");
          }
          playerFunctions(rl, player);
        });
        break;
      case "2":
        console.log(`So du tai khoan: ${player.balance} VND`);
        playerFunctions(rl, player);
        break;
      case "3":
        rl.question("Nhap so tien can nap: ", async (amount) => {
          player.balance += parseInt(amount);
          console.log(`So du moi: ${player.balance} VND`);
          await updateUserData(player, "player.json");
          playerFunctions(rl, player);
        });
        break;
      default:
        console.log("Quay lai menu chinh.");
        mainMenu();
        break;
    }
  });
  return;
}

// Hàm chức năng nhân viêns
async function staffFunctions(rl, staff) {
  console.log("\n--- CHUC NANG NHAN VIEN ---");
  console.log("1. Bao cao tinh trang may");
  console.log("2. Bao cao vi pham");
  console.log("3. Quay lai menu chinh");

  rl.question("Lua chon: ", async (choice) => {
    switch (choice) {
      case "1": // Báo cáo ttình trạng máy
        rl.question("Nhap so phong: ", (room) => {
          rl.question("Nhap so may: ", (computer) => {
            rl.question("Nhap tinh trang: ", (status) => {
              const statusReport = {
                room,
                computer,
                status,
                reporter: staff.username,
                time: new Date().toISOString(),
              };
              saveReport(statusReport, "statusPc.json");
              staffFunctions(rl, staff);
            });
          });
        });
        break;
      case "2": // Báo cáoddi phạm
        rl.question("Nhap ten dang nhap nguoi vi pham: ", (username) => {
          rl.question("Mo ta hanh vi vi pham: ", (report) => {
            const violationReport = {
              username,
              report,
              reporter: staff.username,
              time: new Date().toISOString(),
            };
            saveReport(violationReport, "report.json");
            staffFunctions(rl, staff);
          });
        });
        break;
      default:
        console.log("Quay lai menu chinh.");
        mainMenu();
        break;
    }
  });
  return;
}

async function adminFunctions(rl, admin) {
  console.log("\n--- CHUC NANG QUAN TRI ---");
  console.log("1. Xem doanh thu");
  console.log("2. Xem tinh trang may");
  console.log("3. Xem bao cao vi pham");
  console.log("4. Tao tai khoan");
  console.log("5. Xoa tai khoan");
  console.log("6. Cap nhat thong tin tai khoan");
  console.log("7. Quay lai menu chinh");

  rl.question("Lua chon: ", async (choice) => {
    switch (choice) {
      case "1":
        await viewRevenue();
        break;
      case "2":
        await viewReports("statusPc.json", "Bao cao tinh trang may");
        break;
      case "3":
        await viewReports("report.json", "Bao cao vi pham");
        break;
      case "4":
        await createAccount(rl);
        break;
      case "5":
        await deleteAccount(rl);
        break;
      case "6":
        await updateAccount(rl);
        break;
      case "7":
        console.log("Quay lai menu chinh.");
        mainMenu();
        return;
      default:
        console.log("Lua chon khong hop le.");
        adminFunctions(rl, admin);
        return;
    }
    adminFunctions(rl, admin);
  });
}

async function viewRevenue() {
  const filePath = `${startDir}player.json`;
  try {
    const data = await readJsonFile(filePath);
    const accounts = data.players;
    let totalDeposited = accounts.reduce(
      (sum, acc) => sum + (acc.totalDeposit || 0),
      0
    );
    let totalSpent = accounts.reduce(
      (sum, acc) => sum + (acc.initialBalance - acc.balance),
      0
    );
    console.log(`\nTong tien nap: ${totalDeposited} VND`);
    console.log(`Tong tien su dung: ${totalSpent} VND`);
  } catch (err) {
    console.error("Loi khi doc file doanh thu:", err);
  }
}

async function viewReports(fileName, title) {
  const filePath = `${startDir}${fileName}`;
  try {
    const reports = await readJsonFile(filePath);
    console.log(`\n--- ${title} ---`);
    reports.forEach((report, index) => {
      console.log(`${index + 1}.`, report);
    });
  } catch (err) {
    console.error(`Loi khi doc file ${fileName}:`, err);
  }
}

async function createAccount(rl) {
  rl.question(
    "Nhap loai tai khoan (1: Nguoi choi, 2: Nhan vien): ",
    async (type) => {
      const filePath =
        type === "1" ? `${startDir}player.json` : `${startDir}staff.json`;
      rl.question("Nhap ten dang nhap: ", (username) => {
        rl.question("Nhap mat khau: ", (password) => {
          const newUser = { id: Date.now(), username, password, balance: 0 };
          addUserToFile(filePath, newUser);
        });
      });
    }
  );
}

async function deleteAccount(rl) {
  rl.question(
    "Nhap loai tai khoan can xoa (1: Nguoi choi, 2: Nhan vien): ",
    async (type) => {
      const filePath =
        type === "1" ? `${startDir}player.json` : `${startDir}staff.json`;
      rl.question("Nhap ten dang nhap can xoa: ", async (username) => {
        try {
          let data = await readJsonFile(filePath);
          data = data.filter((acc) => acc.username !== username);
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
          console.log("Tai khoan da duoc xoa.");
        } catch (err) {
          console.error("Loi khi xoa tai khoan:", err);
        }
      });
    }
  );
}

async function updateAccount(rl) {
  rl.question(
    "Nhap loai tai khoan (1: Nguoi choi, 2: Nhan vien): ",
    async (type) => {
      const filePath =
        type === "1" ? `${startDir}player.json` : `${startDir}staff.json`;
      rl.question("Nhap ten dang nhap can cap nhat: ", async (username) => {
        try {
          let data = await readJsonFile(filePath);
          let user = data.find((acc) => acc.username === username);
          if (!user) {
            console.log("Tai khoan khong ton tai.");
            return;
          }
          rl.question("Nhap mat khau moi: ", (password) => {
            user.password = password;
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
            console.log("Thong tin da cap nhat.");
          });
        } catch (err) {
          console.error("Loi khi cap nhat tai khoan:", err);
        }
      });
    }
  );
}

async function addUserToFile(filePath, user) {
  try {
    const data = await readJsonFile(filePath);
    // data.push(user);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    console.log("Tai khoan da duoc tao.");
  } catch (err) {
    console.error("Loi khi tao tai khoan:", err);
  }
}

// Cập nhật dữ liệu người dùng
async function updateUserData(user, fileName) {
  const filePath = `${startDir}${fileName}`;
  try {
    const data = await readJsonFile(filePath);
    const accounts = data[Object.keys(data)[0]];
    const index = accounts.findIndex((acc) => acc.id === user.id);

    if (index !== -1) {
      accounts[index] = user;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
      console.log("Du lieu da duoc cap nhat.");
    }
  } catch (err) {
    console.error("Loi khi cap nhat file:", err);
  }
  return;
}
function saveReport(data, fileName) {
  const filePath = `${startDir}${fileName}`;
  fs.readFile(filePath, "utf8", (err, fileData) => {
    let reports = [];
    if (!err && fileData) {
      reports = JSON.parse(fileData);
    }
    reports.push(data);
    fs.writeFileSync(filePath, JSON.stringify(reports, null, 2), "utf8");
    console.log(`Da luu vao file ${fileName}`);
  });
}

mainMenu();
