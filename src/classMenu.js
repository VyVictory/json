// Class cho các máy tính
class Computer {
  constructor(id, screen, cpu, ram, hardDrive, status) {
    this.id = id;
    this.screen = screen;
    this.cpu = cpu;
    this.ram = ram;
    this.hardDrive = hardDrive;
    this.status = status;
  }
}

// Class cho phòng
class Room {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.computers = [];
  }

  addComputer(computer) {
    this.computers.push(computer);
  }
}

// Class cho người chơi
class Player {
  constructor(username, password, balance, playTime) {
    this.username = username;
    this.password = password;
    this.balance = balance;
    this.playTime = playTime;
  }

  topUp(amount) {
    this.balance += amount;
  }

  playGame(time) {
    const costPerMinute = 1; // Giả sử mỗi phút chơi mất 1 đơn vị tiền
    const totalCost = time * costPerMinute;
    if (this.balance >= totalCost) {
      this.balance -= totalCost;
      this.playTime += time;
      console.log(`Chơi game ${time} phút. Số tiền còn lại: ${this.balance}`);
    } else {
      console.log("Số tiền không đủ để chơi game");
    }
  }

  checkBalance() {
    console.log(`Tài khoản của bạn có ${this.balance} đơn vị tiền`);
  }
}

// Class cho nhân viên
class Employee {
  constructor(username, password, fullName, address, phone) {
    this.username = username;
    this.password = password;
    this.fullName = fullName;
    this.address = address;
    this.phone = phone;
  }

  reportComputerStatus(roomId, computerId, status) {
    // Báo cáo tình trạng máy tính trong phòng
    console.log(`Phòng ${roomId} Máy tính ${computerId} tình trạng: ${status}`);
  }

  reportViolation(username, violation) {
    // Báo cáo vi phạm
    console.log(`Tài khoản ${username} đã vi phạm: ${violation}`);
  }
}

// Class cho quản trị viên
class Admin {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  viewDailyRevenue(transactions) {
    const totalRevenue = transactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
    console.log(`Doanh thu trong ngày: ${totalRevenue}`);
  }

  viewComputerStatus(rooms, status) {
    rooms.forEach((room) => {
      room.computers.forEach((computer) => {
        if (computer.status === status) {
          console.log(
            `Máy tính phòng ${room.name}, ID: ${computer.id} - Trạng thái: ${status}`
          );
        }
      });
    });
  }

  viewViolationReports(violations) {
    violations.forEach((violation) => {
      console.log(
        `Tài khoản: ${violation.username} - Vi phạm: ${violation.violation}`
      );
    });
  }
}

module.exports = { Computer, Room, Player, Employee, Admin };
