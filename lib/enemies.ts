import { Enemy } from "./types";
import { CELL_SIZE, SWORD_DAMAGE, SWORD_RANGE, KNOCKBACK_DURATION, KNOCKBACK_FRICTION } from "./constants";

// Enemy configurations
export const ENEMY_CONFIGS = {
  slime: {
    emoji: "🟢",
    health: 30,
    speed: 1.0, // pixels per frame
    damage: 8,
    name: "Slime",
  },
  bat: {
    emoji: "🦇", 
    health: 20,
    speed: 1.8,
    damage: 6,
    name: "Bat",
  },
  skeleton: {
    emoji: "💀",
    health: 50,
    speed: 0.8,
    damage: 15,
    name: "Skeleton",
  },
} as const;

// Create a new enemy
export const createEnemy = (
  id: string,
  type: Enemy["type"],
  x: number,
  y: number,
  scene: string
): Enemy => {
  const config = ENEMY_CONFIGS[type];
  
  return {
    id,
    type,
    x,
    y,
    pixelX: x * CELL_SIZE,
    pixelY: y * CELL_SIZE,
    health: config.health,
    maxHealth: config.health,
    speed: config.speed,
    damage: config.damage,
    lastDamageTime: 0,
    scene,
    facing: "down",
    isMoving: false,
    behaviorTimer: 0,
    currentBehavior: "chase",
    isKnockedBack: false,
    knockbackVelocityX: 0,
    knockbackVelocityY: 0,
    knockbackTimer: 0,
  };
};

// Get enemy display emoji
export const getEnemyDisplay = (enemy: Enemy): string => {
  return ENEMY_CONFIGS[enemy.type].emoji;
};

// Check if two entities are close enough to collide
export const checkEntityCollision = (
  entity1: { pixelX: number; pixelY: number },
  entity2: { pixelX: number; pixelY: number },
  threshold: number = CELL_SIZE * 0.7
): boolean => {
  const dx = entity1.pixelX - entity2.pixelX;
  const dy = entity1.pixelY - entity2.pixelY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < threshold;
};

// Calculate distance between two points
export const getDistance = (
  x1: number, y1: number,
  x2: number, y2: number
): number => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};

// Get direction from one point to another (normalized)
export const getDirection = (
  fromX: number, fromY: number,
  toX: number, toY: number
): { x: number; y: number } => {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance === 0) {
    return { x: 0, y: 0 };
  }
  
  return {
    x: dx / distance,
    y: dy / distance,
  };
};

// Update enemy AI behavior
export const updateEnemyAI = (
  enemy: Enemy,
  playerPixelX: number,
  playerPixelY: number,
  worldBounds: { width: number; height: number }
): Enemy => {
  const updatedEnemy = { ...enemy };
  
  // Handle knockback first (overrides normal AI)
  if (updatedEnemy.isKnockedBack && updatedEnemy.knockbackTimer > 0) {
    // Apply knockback movement
    updatedEnemy.pixelX += updatedEnemy.knockbackVelocityX;
    updatedEnemy.pixelY += updatedEnemy.knockbackVelocityY;
    
    // Apply friction to slow down knockback
    updatedEnemy.knockbackVelocityX *= KNOCKBACK_FRICTION;
    updatedEnemy.knockbackVelocityY *= KNOCKBACK_FRICTION;
    
    // Keep enemy within world bounds
    updatedEnemy.pixelX = Math.max(CELL_SIZE, Math.min(worldBounds.width - CELL_SIZE, updatedEnemy.pixelX));
    updatedEnemy.pixelY = Math.max(CELL_SIZE, Math.min(worldBounds.height - CELL_SIZE, updatedEnemy.pixelY));
    
    // Update grid position
    updatedEnemy.x = Math.round(updatedEnemy.pixelX / CELL_SIZE);
    updatedEnemy.y = Math.round(updatedEnemy.pixelY / CELL_SIZE);
    
    // Countdown knockback timer
    updatedEnemy.knockbackTimer -= 16; // ~60 FPS
    
    // End knockback when timer expires
    if (updatedEnemy.knockbackTimer <= 0) {
      updatedEnemy.isKnockedBack = false;
      updatedEnemy.knockbackVelocityX = 0;
      updatedEnemy.knockbackVelocityY = 0;
      updatedEnemy.knockbackTimer = 0;
    }
    
    return updatedEnemy;
  }
  
  // Update behavior timer
  updatedEnemy.behaviorTimer += 16; // ~60 FPS
  
  // Distance to player
  const distanceToPlayer = getDistance(
    enemy.pixelX, enemy.pixelY,
    playerPixelX, playerPixelY
  );
  
  // Determine behavior based on distance and timer
  if (distanceToPlayer < CELL_SIZE * 8) {
    // Player is close - chase behavior
    updatedEnemy.currentBehavior = "chase";
    updatedEnemy.behaviorTimer = 0;
  } else if (updatedEnemy.behaviorTimer > 2000) {
    // Change behavior every 2 seconds
    const rand = Math.random();
    if (rand < 0.6) {
      updatedEnemy.currentBehavior = "chase";
    } else if (rand < 0.8) {
      updatedEnemy.currentBehavior = "wander";
    } else {
      updatedEnemy.currentBehavior = "pause";
    }
    updatedEnemy.behaviorTimer = 0;
  }
  
  // Execute behavior
  switch (updatedEnemy.currentBehavior) {
    case "chase":
      // Move toward player with some unpredictability
      const chaseDirection = getDirection(
        enemy.pixelX, enemy.pixelY,
        playerPixelX, playerPixelY
      );
      
      // Add some randomness to make movement unpredictable
      const randomOffset = 0.3;
      const randomX = (Math.random() - 0.5) * randomOffset;
      const randomY = (Math.random() - 0.5) * randomOffset;
      
      updatedEnemy.pixelX += (chaseDirection.x + randomX) * enemy.speed;
      updatedEnemy.pixelY += (chaseDirection.y + randomY) * enemy.speed;
      updatedEnemy.isMoving = true;
      
      // Update facing direction
      if (Math.abs(chaseDirection.x) > Math.abs(chaseDirection.y)) {
        updatedEnemy.facing = chaseDirection.x > 0 ? "right" : "left";
      } else {
        updatedEnemy.facing = chaseDirection.y > 0 ? "down" : "up";
      }
      break;
      
    case "wander":
      // Random wandering movement
      if (!updatedEnemy.targetX || !updatedEnemy.targetY || updatedEnemy.behaviorTimer > 1000) {
        // Set new random target
        const margin = CELL_SIZE * 2;
        updatedEnemy.targetX = margin + Math.random() * (worldBounds.width - margin * 2);
        updatedEnemy.targetY = margin + Math.random() * (worldBounds.height - margin * 2);
      }
      
      const wanderDirection = getDirection(
        enemy.pixelX, enemy.pixelY,
        updatedEnemy.targetX!, updatedEnemy.targetY!
      );
      
      updatedEnemy.pixelX += wanderDirection.x * enemy.speed * 0.5;
      updatedEnemy.pixelY += wanderDirection.y * enemy.speed * 0.5;
      updatedEnemy.isMoving = true;
      
      if (Math.abs(wanderDirection.x) > Math.abs(wanderDirection.y)) {
        updatedEnemy.facing = wanderDirection.x > 0 ? "right" : "left";
      } else {
        updatedEnemy.facing = wanderDirection.y > 0 ? "down" : "up";
      }
      break;
      
    case "pause":
      // Stand still for a moment
      updatedEnemy.isMoving = false;
      break;
  }
  
  // Keep enemy within world bounds
  updatedEnemy.pixelX = Math.max(CELL_SIZE, Math.min(worldBounds.width - CELL_SIZE, updatedEnemy.pixelX));
  updatedEnemy.pixelY = Math.max(CELL_SIZE, Math.min(worldBounds.height - CELL_SIZE, updatedEnemy.pixelY));
  
  // Update grid position
  updatedEnemy.x = Math.round(updatedEnemy.pixelX / CELL_SIZE);
  updatedEnemy.y = Math.round(updatedEnemy.pixelY / CELL_SIZE);
  
  return updatedEnemy;
};

// Check if a point is within sword range and direction
export const isInSwordRange = (
  playerPixelX: number,
  playerPixelY: number,
  playerFacing: "up" | "down" | "left" | "right",
  targetPixelX: number,
  targetPixelY: number
): boolean => {
  const dx = targetPixelX - playerPixelX;
  const dy = targetPixelY - playerPixelY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Check if target is within range
  if (distance > SWORD_RANGE) {
    return false;
  }
  
  // Check if target is in the direction the player is facing
  let inDirection = false;
  switch (playerFacing) {
    case "up":
      inDirection = dy < -CELL_SIZE * 0.3; // Target is above player
      break;
    case "down":
      inDirection = dy > CELL_SIZE * 0.3; // Target is below player
      break;
    case "left":
      inDirection = dx < -CELL_SIZE * 0.3; // Target is left of player
      break;
    case "right":
      inDirection = dx > CELL_SIZE * 0.3; // Target is right of player
      break;
    default:
      inDirection = false;
  }
  
  return inDirection;
};

// Apply sword attack to enemies
export const applySwordAttack = (
  enemies: Enemy[],
  playerPixelX: number,
  playerPixelY: number,
  playerFacing: "up" | "down" | "left" | "right"
): Enemy[] => {
  return enemies.map(enemy => {
    // Check if enemy is in sword range and direction
    if (isInSwordRange(playerPixelX, playerPixelY, playerFacing, enemy.pixelX, enemy.pixelY)) {
      // Calculate knockback velocity (spread over time instead of instant)
      let knockbackVelX = 0;
      let knockbackVelY = 0;
      const knockbackSpeed = 8; // pixels per frame
      
      switch (playerFacing) {
        case "up":
          knockbackVelY = -knockbackSpeed;
          break;
        case "down":
          knockbackVelY = knockbackSpeed;
          break;
        case "left":
          knockbackVelX = -knockbackSpeed;
          break;
        case "right":
          knockbackVelX = knockbackSpeed;
          break;
      }
      
      return {
        ...enemy,
        health: Math.max(0, enemy.health - SWORD_DAMAGE),
        isKnockedBack: true,
        knockbackVelocityX: knockbackVelX,
        knockbackVelocityY: knockbackVelY,
        knockbackTimer: KNOCKBACK_DURATION,
        currentBehavior: "pause", // Stop normal AI during knockback
      };
    }
    
    return enemy;
  });
};