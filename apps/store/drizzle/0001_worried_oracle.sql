CREATE TABLE `order_admin_notes` (
	`id` varchar(36) NOT NULL,
	`order_id` varchar(36) NOT NULL,
	`note` text NOT NULL,
	`created_by_user_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `order_admin_notes_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` varchar(36) NOT NULL,
	`order_id` varchar(36) NOT NULL,
	`product_id` varchar(36),
	`variant_id` varchar(36),
	`product_name_en` varchar(255) NOT NULL,
	`product_name_ar` varchar(255) NOT NULL,
	`sku` varchar(120) NOT NULL,
	`quantity` int unsigned NOT NULL,
	`unit_price_minor_units` int unsigned NOT NULL,
	`line_total_minor_units` int unsigned NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--> statement-breakpoint
CREATE TABLE `order_payment_history` (
	`id` varchar(36) NOT NULL,
	`payment_id` varchar(36) NOT NULL,
	`previous_status` varchar(40),
	`next_status` enum('pending_payment','awaiting_verification','paid','failed','refunded','cash_on_delivery') NOT NULL,
	`previous_reference` varchar(255),
	`next_reference` varchar(255),
	`note` text,
	`changed_by_user_id` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `order_payment_history_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--> statement-breakpoint
CREATE TABLE `order_payments` (
	`id` varchar(36) NOT NULL,
	`order_id` varchar(36) NOT NULL,
	`method` enum('cod','wallet','instapay') NOT NULL,
	`status` enum('pending_payment','awaiting_verification','paid','failed','refunded','cash_on_delivery') NOT NULL DEFAULT 'pending_payment',
	`amount_minor_units` int unsigned NOT NULL,
	`customer_reference` varchar(255),
	`verification_notes` text,
	`verified_by_user_id` varchar(36),
	`verified_at` timestamp NULL DEFAULT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `order_payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `order_payments_order_unique` UNIQUE(`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--> statement-breakpoint
CREATE TABLE `order_shipping_history` (
	`id` varchar(36) NOT NULL,
	`order_id` varchar(36) NOT NULL,
	`previous_status` varchar(40),
	`next_status` enum('pending_confirmation','shipping_details_confirmed','processing','shipped','delivered','cancelled') NOT NULL,
	`previous_shipping_fee_minor_units` int unsigned,
	`next_shipping_fee_minor_units` int unsigned NOT NULL,
	`previous_shipping_method` varchar(120),
	`next_shipping_method` varchar(120),
	`note` text,
	`changed_by_user_id` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `order_shipping_history_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` varchar(36) NOT NULL,
	`order_number` varchar(32) NOT NULL,
	`customer_id` varchar(36) NOT NULL,
	`shipping_status` enum('pending_confirmation','shipping_details_confirmed','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending_confirmation',
	`currency_code` varchar(3) NOT NULL DEFAULT 'EGP',
	`subtotal_minor_units` int unsigned NOT NULL,
	`shipping_fee_minor_units` int unsigned NOT NULL DEFAULT 0,
	`total_minor_units` int unsigned NOT NULL,
	`customer_name` varchar(160) NOT NULL,
	`customer_email` varchar(254) NOT NULL,
	`customer_phone` varchar(32) NOT NULL,
	`governorate` varchar(120) NOT NULL,
	`city_area` varchar(160) NOT NULL,
	`street_address` varchar(255) NOT NULL,
	`building` varchar(80),
	`apartment` varchar(80),
	`postal_code` varchar(32),
	`delivery_notes` text,
	`shipping_method` varchar(120),
	`estimated_delivery` varchar(160),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_number_unique` UNIQUE(`order_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--> statement-breakpoint
ALTER TABLE `order_admin_notes` ADD CONSTRAINT `order_admin_notes_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_admin_notes` ADD CONSTRAINT `order_admin_notes_created_by_user_id_users_id_fk` FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_variant_id_product_variants_id_fk` FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_payment_history` ADD CONSTRAINT `order_payment_history_payment_id_order_payments_id_fk` FOREIGN KEY (`payment_id`) REFERENCES `order_payments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_payment_history` ADD CONSTRAINT `order_payment_history_changed_by_user_id_users_id_fk` FOREIGN KEY (`changed_by_user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_payments` ADD CONSTRAINT `order_payments_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_payments` ADD CONSTRAINT `order_payments_verified_by_user_id_users_id_fk` FOREIGN KEY (`verified_by_user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_shipping_history` ADD CONSTRAINT `order_shipping_history_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_shipping_history` ADD CONSTRAINT `order_shipping_history_changed_by_user_id_users_id_fk` FOREIGN KEY (`changed_by_user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_customer_id_customer_profiles_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customer_profiles`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `order_admin_notes_order_created_index` ON `order_admin_notes` (`order_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `order_items_order_index` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE INDEX `order_items_product_index` ON `order_items` (`product_id`);--> statement-breakpoint
CREATE INDEX `order_items_variant_index` ON `order_items` (`variant_id`);--> statement-breakpoint
CREATE INDEX `order_payment_history_payment_created_index` ON `order_payment_history` (`payment_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `order_payments_status_created_index` ON `order_payments` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `order_shipping_history_order_created_index` ON `order_shipping_history` (`order_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `orders_customer_created_index` ON `orders` (`customer_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `orders_shipping_status_created_index` ON `orders` (`shipping_status`,`created_at`);